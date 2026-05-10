import type { Box } from './types'

export interface Rect {
  left: number
  top: number
  right: number
  bottom: number
}

export function toRect(box: Box): Rect {
  return {
    left: box.x,
    top: box.y,
    right: box.x + (box.w ?? 0),
    bottom: box.y + (box.h ?? 0),
  }
}

export function overlaps(a: Box, b: Box): boolean {
  const ra = toRect(a)
  const rb = toRect(b)
  return ra.left < rb.right && ra.right > rb.left && ra.top < rb.bottom && ra.bottom > rb.top
}

export function boxStyle(box: Box): React.CSSProperties {
  return {
    position: 'absolute',
    left: box.x,
    top: box.y,
    width: box.w,
    height: box.h,
    zIndex: box.z ?? 0,
  }
}
