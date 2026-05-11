import { NextRequest } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const LOG_DIR = path.join(process.cwd(), 'logs')
const LOG_FILE = path.join(LOG_DIR, 'debug.log')

export async function POST(req: NextRequest) {
  try {
    await fs.mkdir(LOG_DIR, { recursive: true })
    const body = await req.json()

    // clear log
    if (body.clear) {
      await fs.writeFile(LOG_FILE, '', 'utf-8')
      return new Response('ok', { status: 200 })
    }

    // scan complete marker
    if (body.scanComplete) {
      const total = body.total ?? 0
      const tc = body.totalCollisions ?? 0
      const ts = new Date().toISOString().replace('T', ' ').slice(0, 19)
      const line = `[${ts}] SCAN ${total} pages ${tc > 0 ? tc + ' collisions' : 'all clean'}`
      await fs.appendFile(LOG_FILE, line + '\n', 'utf-8')
      return new Response('ok', { status: 200 })
    }

    // append log lines
    const lines = body.lines as string[] | undefined
    if (!lines || lines.length === 0) return new Response('ok', { status: 200 })
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19)
    const entry = [`[${timestamp}]`, ...lines, ''].join('\n')
    await fs.appendFile(LOG_FILE, entry, 'utf-8')
    return new Response('ok', { status: 200 })
  } catch {
    return new Response('fail', { status: 500 })
  }
}
