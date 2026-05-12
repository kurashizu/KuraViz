import { createServer } from "net";
import { firefox } from "playwright";
import { execSync, spawn, spawnSync } from "child_process";
import { mkdirSync, rmSync } from "fs";
import { resolve } from "path";
import { setTimeout } from "timers/promises";

const IS_CONTAINER    = process.env.IS_CONTAINER === "1";
const SCAFFOLD        = IS_CONTAINER
    ? "/app/scaffold"
    : resolve(import.meta.dirname, "..");
const OUTPUT          = process.argv[2] ?? "output.mp4";
const PAGE_TIMEOUT_MS = 5 * 60 * 1000;
const DISPLAY         = process.env.DISPLAY ?? ":99";

// ── Logging ───────────────────────────────────────────────────────────────────

function log(msg) {
    console.log(`[record] ${msg}`);
}
function warn(msg) {
    console.warn(`[record] ⚠ ${msg}`);
}
function fail(msg) {
    console.error(`[record] ✖ ${msg}`);
    process.exit(1);
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getPort() {
    return new Promise((resolve, reject) => {
        const srv = createServer();
        srv.listen(0, "127.0.0.1", () => {
            const port = srv.address().port;
            srv.close(() => resolve(port));
        });
        srv.on("error", reject);
    });
}

function run(cmd, cwd = SCAFFOLD) {
    log(`$ ${cmd}`);
    try {
        execSync(cmd, { cwd, stdio: "inherit", shell: "/bin/bash" });
    } catch {
        fail(`Command failed: ${cmd}`);
    }
}

function detectVaapi() {
    const device = "/dev/dri/renderD128";
    try {
        execSync(`test -e ${device}`, { stdio: "ignore" });
    } catch {
        warn(`VAAPI device ${device} not found — falling back to CPU`);
        return null;
    }
    const encoders = spawnSync("ffmpeg", ["-hide_banner", "-encoders"], {
        encoding: "utf-8",
    });
    if (!encoders.stdout.includes("h264_vaapi")) {
        warn("ffmpeg has no h264_vaapi encoder — falling back to CPU");
        return null;
    }
    const test = spawnSync(
        "ffmpeg",
        [
            "-hide_banner",
            "-loglevel",
            "error",
            "-f",
            "lavfi",
            "-i",
            "color=black:s=64x64:d=0.1",
            "-vf",
            "format=nv12,hwupload",
            "-vaapi_device",
            device,
            "-c:v",
            "h264_vaapi",
            "-f",
            "null",
            "-",
        ],
        { encoding: "utf-8" },
    );
    if (test.status !== 0) {
        warn(
            `VAAPI test encode failed: ${test.stderr.trim()} — falling back to CPU`,
        );
        return null;
    }
    return device;
}

function videoEncodeArgs(vaapiDevice) {
    if (vaapiDevice) {
        log(`Hardware encoding via VAAPI (${vaapiDevice})`);
        return [
            "-vf",
            "format=nv12,hwupload",
            "-vaapi_device",
            vaapiDevice,
            "-c:v",
            "h264_vaapi",
            "-b:v",
            "8M",
        ];
    }
    warn("Software encoding via libx264 (slower)");
    return ["-c:v", "libx264", "-preset", "veryfast", "-crf", "23"];
}

function findFirefox() {
    const candidates = [
        "/usr/bin/firefox",
        "/usr/bin/firefox-developer-edition",
        "/usr/bin/librewolf",
    ];
    for (const p of candidates) {
        try {
            execSync(`test -x ${p}`, { stdio: "ignore" });
            return p;
        } catch {}
    }
    return null; // let Playwright use its bundled Firefox
}

function startFfmpeg(vaapiDevice) {
    const args = [
        "-y",
        // Hide the mouse cursor from the recording
        "-f",
        "x11grab",
        "-r",
        "30",
        "-s",
        "1920x1080",
        "-draw_mouse",
        "0",
        "-i",
        `${DISPLAY}.0`,
        "-f",
        "pulse",
        "-i",
        "kuraviz_sink.monitor",
        ...videoEncodeArgs(vaapiDevice),
        "-af",
        "aresample=async=1:first_pts=0",
        "-c:a",
        "aac",
        "-b:a",
        "192k",
        OUTPUT,
    ];
    log(`ffmpeg ${args.join(" ")}`);
    const proc = spawn("ffmpeg", args, {
        stdio: ["ignore", "ignore", "pipe"],
        env: { ...process.env, DISPLAY, PULSE_SINK: "kuraviz_sink", PULSE_LATENCY_MSEC: "200" },
    });
    proc.stderr.on("data", (d) => process.stderr.write(`[ffmpeg] ${d}`));
    proc.on("error", (e) => warn(`FFmpeg process error: ${e.message}`));
    return proc;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
    try { mkdirSync(resolve(SCAFFOLD, "logs"), { recursive: true }); } catch {}

    // Clean up stale profile to avoid translate/UI state carrying over
    rmSync("/tmp/kuraviz-recording-profile", { recursive: true, force: true });

    // 1. Pick a free port and start Next.js
    const port = await getPort();
    log(`Starting Next.js on port ${port}...`);
    const server = spawn(
        "npx",
        ["next", "start", "-p", String(port), "-H", "127.0.0.1"],
        {
            cwd: SCAFFOLD,
            stdio: "pipe",
            shell: "/bin/bash",
        },
    );
    server.stdout.on("data", (d) => process.stdout.write(`[next] ${d}`));
    server.stderr.on("data", (d) => process.stderr.write(`[next] ${d}`));
    await setTimeout(4000);

    // 3. Start a virtual display (skipped in container — entrypoint handles it)
    let xvfb = null;
    if (!IS_CONTAINER) {
        log(`Starting Xvfb on ${DISPLAY}...`);
        xvfb = spawn("Xvfb", [DISPLAY, "-screen", "0", "1920x1080x24", "-ac"], {
            stdio: "ignore",
        });
        xvfb.on("error", (e) => warn(`Xvfb error: ${e.message}`));
        await setTimeout(1000);
    } else {
        log("Container mode — Xvfb already running");
    }

    // 4. Create a virtual audio sink (skipped in container)
    let sinkModule = null;
    if (!IS_CONTAINER) {
        log("Creating virtual audio sink...");
        try {
            sinkModule = execSync(
                "pactl load-module module-null-sink sink_name=kuraviz_sink sink_properties=device.description=KuraViz",
                { env: { ...process.env, DISPLAY }, encoding: "utf-8" },
            ).trim();
            log(`Audio sink loaded (module id ${sinkModule})`);
        } catch (e) {
            fail(`pactl failed: ${e.message}`);
        }
        await setTimeout(500);
    } else {
        log("Container mode — audio sink already loaded");
    }

    // 5. Detect encoder (do this early, before launching browser)
    log("Detecting video encoder...");
    const vaapiDevice = detectVaapi();

    // 6. Launch Firefox
    const url = `http://127.0.0.1:${port}/?record=1`;
    log(`Navigating to ${url}`);

    const browserOptions = {
        headless: false,
        args: ["--kiosk"],
        viewport: { width: 1920, height: 1080 },
        env: { ...process.env, DISPLAY, PULSE_SINK: "kuraviz_sink" },
    };

    // On host, try system Firefox first; fall back to Playwright bundled
    if (!IS_CONTAINER) {
        const firefoxPath = findFirefox();
        if (firefoxPath) {
            log(`Using system Firefox: ${firefoxPath}`);
            browserOptions.executablePath = firefoxPath;
        } else {
            log("No system Firefox found — using Playwright bundled Firefox");
        }
    } else {
        log("Container mode — using Playwright bundled Firefox");
    }

    const browser = await firefox.launchPersistentContext(
        "/tmp/kuraviz-recording-profile",
        browserOptions,
    );
    const page = browser.pages()[0] || await browser.newPage({
        viewport: { width: 1920, height: 1080 },
    });
    page.on("pageerror", (e) => warn(`Page JS error: ${e.message}`));

    let lastPageAt = Date.now();
    let currentPage = "(init)";
    let done = false;
    let timedOut = false;
    let startResolve;
    const startPromise = new Promise((r) => { startResolve = r; });

    const donePromise = new Promise((resolveP) => {
        page.on("console", (msg) => {
            const text = msg.text();
            process.stdout.write(`[page] ${text}\n`);
            const m = text.match(/\[record\]\s+(\S+)/);
            if (!m) return;
            const id = m[1];
            if (id === "done") {
                log("Playback finished ✔");
                done = true;
                resolveP();
            } else {
                log(`Recording page: ${id}`);
                currentPage = id;
                lastPageAt = Date.now();
                if (startResolve) { startResolve(); startResolve = null; }
            }
        });
    });

    // Navigate — listeners already set up, won't miss page 1
    await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });

    const timeoutPromise = new Promise((resolveP) => {
        const iv = setInterval(() => {
            if (done) {
                clearInterval(iv);
                resolveP();
                return;
            }
            const elapsed = Date.now() - lastPageAt;
            if (elapsed > PAGE_TIMEOUT_MS) {
                warn(`Page '${currentPage}' stuck for ${Math.round(elapsed / 1000)}s — aborting`);
                timedOut = true;
                clearInterval(iv);
                resolveP();
            } else if (elapsed > 0 && elapsed % 15000 < 3000) {
                log(`Still on '${currentPage}' (${Math.round(elapsed / 1000)}s elapsed)`);
            }
        }, 3000);
    });
    log("Waiting for #slide-viewport...");
    await page.waitForSelector("#slide-viewport", { timeout: 15000 });

    // Wait for first [record] page message (instantly resolved in console listener)
    log("Waiting for playback to start...");
    await Promise.race([
        startPromise,
        new Promise((_, rejectP) => globalThis.setTimeout(() => rejectP(new Error("Playback did not start within 30s")), 30000)),
    ]);

    // 7. FFmpeg starts NOW — playback has begun
    log("Playback started — starting FFmpeg...");
    const ffmpeg = startFfmpeg(vaapiDevice);
    await setTimeout(300);

    if (ffmpeg.exitCode !== null) {
        fail("FFmpeg exited immediately — check the arguments printed above");
    }
    log("FFmpeg is running");

    // 8. Wait for playback to complete or timeout
    await Promise.race([donePromise, timeoutPromise]);
    await browser.close();

    // 10. Stop FFmpeg gracefully so it writes the MP4 trailer
    log("Sending SIGINT to FFmpeg...");
    ffmpeg.kill("SIGINT");
    await new Promise((r) =>
        ffmpeg.on("close", (code) => {
            log(`FFmpeg exited with code ${code}`);
            r();
        }),
    );

    // 11. Cleanup
    log("Cleaning up...");
    server.kill();
    if (sinkModule) {
        try {
            execSync(`pactl unload-module ${sinkModule}`, {
                env: { ...process.env, DISPLAY },
            });
            log("Audio sink unloaded");
        } catch {}
    }
    if (xvfb) { xvfb.kill(); log("Xvfb stopped"); }

    if (timedOut) fail("Recording failed due to page timeout");
    log(`✔ Output saved: ${OUTPUT}`);
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
