import type { Box } from './types'

export interface Rect {
  left: number
  top: number
  right: number
  bottom: number
}

export function toRect(box: Box): Rect | null {
  if (box.x === undefined || box.y === undefined) return null
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
  if (!ra || !rb) return false
  return ra.left < rb.right && ra.right > rb.left && ra.top < rb.bottom && ra.bottom > rb.top
}

export function boxStyle(box: Box): React.CSSProperties {
  const style: React.CSSProperties = {
    width: box.w,
    height: box.h,
  }
  if (box.x !== undefined) style.left = box.x
  if (box.y !== undefined) style.top = box.y
  if (box.z !== undefined) style.zIndex = box.z
  if (box.x !== undefined || box.y !== undefined) {
    style.position = 'absolute'
  }
  return style
}
