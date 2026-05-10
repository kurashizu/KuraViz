import { NextRequest } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const LOG_DIR = path.join(process.cwd(), 'logs')
const LOG_FILE = path.join(LOG_DIR, 'debug.log')

export async function POST(req: NextRequest) {
  try {
    await fs.mkdir(LOG_DIR, { recursive: true })
    const body = await req.json()
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19)
    const lines = body.lines as string[] | undefined
    if (!lines || lines.length === 0) return new Response('ok', { status: 200 })
    const entry = [`[${timestamp}]`, ...lines, ''].join('\n')
    await fs.appendFile(LOG_FILE, entry, 'utf-8')
    return new Response('ok', { status: 200 })
  } catch {
    return new Response('fail', { status: 500 })
  }
}
