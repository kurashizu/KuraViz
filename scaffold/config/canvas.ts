export const canvas = {
  width: 1920,
  height: 1080,
  aspectRatio: '16/9' as const,
}

export const server = {
  host: process.env.HOSTNAME ?? '0.0.0.0',
  port: Number(process.env.PORT) || 9999,
}

export type CanvasConfig = typeof canvas
export type ServerConfig = typeof server
