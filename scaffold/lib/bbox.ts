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
  return ra.left <= rb.right && ra.right >= rb.left && ra.top <= rb.bottom && ra.bottom >= rb.top
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

export function scanOverlaps(container: HTMLElement): { a: string; b: string; ra: DOMRect; rb: DOMRect }[] {
  const items: { el: HTMLElement; id: string; rect: DOMRect }[] = []
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT)
  let node: Node | null
  while ((node = walker.nextNode())) {
    const el = node as HTMLElement
    const style = getComputedStyle(el)
    if (style.position !== 'absolute') continue
    const rect = el.getBoundingClientRect()
    const id = el.getAttribute('data-box-id') || el.tagName.toLowerCase() + (el.textContent?.slice(0, 20) || '')
    items.push({ el, id: `${id}[${Math.round(rect.left)},${Math.round(rect.top)} ${Math.round(rect.width)}x${Math.round(rect.height)}]`, rect })
  }

  const collisions: { a: string; b: string; ra: DOMRect; rb: DOMRect }[] = []
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const ai = items[i]
      const bi = items[j]
      if (ai.rect.left <= bi.rect.right && ai.rect.right >= bi.rect.left && ai.rect.top <= bi.rect.bottom && ai.rect.bottom >= bi.rect.top) {
        collisions.push({ a: ai.id, b: bi.id, ra: ai.rect, rb: bi.rect })
      }
    }
  }
  return collisions
}
