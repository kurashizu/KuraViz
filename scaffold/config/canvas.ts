export const canvas = {
  width: 1920,
  height: 1080,
  aspectRatio: '16/9' as const,
}

export const server = {
  host: '0.0.0.0',
  port: 9999,
}

export type CanvasConfig = typeof canvas
export type ServerConfig = typeof server
