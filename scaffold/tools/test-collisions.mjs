import { createServer } from "net";
import { firefox } from "playwright";
import { execSync, spawn } from "child_process";
import { existsSync, readFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { setTimeout } from "timers/promises";

const IS_CONTAINER = process.env.IS_CONTAINER === "1";
const SCAFFOLD = IS_CONTAINER
    ? "/app/scaffold"
    : resolve(import.meta.dirname, "..");
const LOG_FILE = resolve(SCAFFOLD, "logs", "debug.log");

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
    console.log(`\n$ ${cmd}`);
    try {
        execSync(cmd, { cwd, stdio: "inherit", shell: "/bin/bash" });
    } catch {
        console.error(`\n✖ Build failed — check errors above.`);
        process.exit(1);
    }
}

async function main() {
    if (!IS_CONTAINER) {
        run("npm run build");
    } else {
        console.log("Container mode — skipping build (host should have built)");
    }

    const port = await getPort();
    console.log(`\nStarting server on port ${port}...`);

    const server = spawn(
        "npx",
        ["next", "start", "-p", String(port), "-H", "127.0.0.1"],
        {
            cwd: SCAFFOLD,
            stdio: "pipe",
            shell: "/bin/bash",
        },
    );
    server.stderr.on("data", (d) => process.stderr.write(d));
    await setTimeout(4000);

    mkdirSync(dirname(LOG_FILE), { recursive: true });
    if (existsSync(LOG_FILE)) {
        execSync(`> '${LOG_FILE}'`, { shell: "/bin/bash" });
    }

    console.log(
        `Opening http://127.0.0.1:${port}/?debug=auto — waiting for scan...`,
    );
    const browser = await firefox.launch({ headless: true });
    const page = await browser.newPage({
        viewport: { width: 1920, height: 1080 },
    });
    await page.goto(`http://127.0.0.1:${port}/?debug=auto`, {
        waitUntil: "networkidle",
        timeout: 30000,
    });

    let summary = "";
    for (let i = 0; i < 120; i++) {
        await setTimeout(1000);
        if (existsSync(LOG_FILE)) {
            const log = readFileSync(LOG_FILE, "utf-8");
            for (const line of log.split("\n")) {
                if (line.includes("SCAN ")) summary = line;
            }
            if (summary) break;
        }
    }

    await browser.close();
    server.kill();

    if (summary) console.log(`\n=== ${summary} ===`);

    if (!existsSync(LOG_FILE)) {
        console.log("\nNo log file found.");
        process.exit(1);
    }

    const log = readFileSync(LOG_FILE, "utf-8");

    // Parse collisions grouped by page
    const pages = [];
    let currentPage = null;
    for (const line of log.split("\n")) {
        const pageMatch = line.match(/^PAGE (.+)$/);
        if (pageMatch) {
            currentPage = { name: pageMatch[1], collisions: [] };
            pages.push(currentPage);
        } else if (
            currentPage &&
            (line.startsWith("  OVERLAP") ||
                line.startsWith("  OVERFLOW") ||
                line.startsWith("  CONTENT_OVERFLOW") ||
                line.startsWith("  EXCEED"))
        ) {
            currentPage.collisions.push(line.trim());
        }
    }

    const totalCollisions = pages.reduce((s, p) => s + p.collisions.length, 0);
    const pagesWithCollisions = pages.filter((p) => p.collisions.length > 0);

    if (totalCollisions === 0) {
        console.log("All clean — no collisions detected.\n");
        process.exit(0);
    }

    console.log(
        `\n${totalCollisions} collision(s) across ${pagesWithCollisions.length} page(s):\n`,
    );
    for (const page of pagesWithCollisions) {
        console.log(`  ${page.name}`);
        for (const c of page.collisions.slice(0, 8)) {
            console.log(`    ${c}`);
        }
        if (page.collisions.length > 8) {
            console.log(`    ... and ${page.collisions.length - 8} more`);
        }
        console.log();
    }
    process.exit(1);
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
