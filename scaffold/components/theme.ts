export const colors = {
  mermaid: {
    nodeBorder: '#A5B4FC',
    section: '#252A3D',
    leaf: '#1E2438',
    leafBorder: '#4F5680',
    leafText: '#D1D5DB',
  },
  base: {
    white: '#FFFFFF',
    black: '#000000',
  },
  brand: {
    primary: '#6366F1',
    secondary: '#06B6D4',
    accent: '#F59E0B',
  },
  surface: {
    bg: '#0F1117',
    card: '#1A1D2B',
    border: '#2E3144',
  },
  text: {
    primary: '#F1F3F9',
    secondary: '#9CA3AF',
    dim: '#6B7280',
  },
  semantic: {
    success: '#22C55E',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',
  },
} as const

export const typography = {
  h1: { fontSize: 72, fontWeight: 700, lineHeight: 1.2, color: colors.text.primary },
  h2: { fontSize: 54, fontWeight: 600, lineHeight: 1.3, color: colors.text.primary },
  h3: { fontSize: 42, fontWeight: 600, lineHeight: 1.4, color: colors.text.primary },
  body: { fontSize: 30, fontWeight: 400, lineHeight: 1.6, color: colors.text.secondary },
  caption: { fontSize: 22, fontWeight: 400, lineHeight: 1.5, color: colors.text.dim },
  code: { fontSize: 28, fontWeight: 400, lineHeight: 1.5, color: colors.brand.secondary },
  watermark: { fontSize: 28, fontWeight: 300, lineHeight: 1.5, color: colors.text.dim },
} as const

export type TextVariant = keyof typeof typography

export const fonts = {
  sans: 'system-ui, sans-serif',
  mono: 'monospace',
} as const

export const canvas = {
  width: 1920,
  height: 1080,
  aspectRatio: '16/9' as const,
} as const

export type CanvasConfig = typeof canvas
