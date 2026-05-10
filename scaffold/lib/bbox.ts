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
  const cr = container.getBoundingClientRect()
  const items: { el: HTMLElement; id: string; rect: DOMRect }[] = []

  // only check top-level absolutely-positioned children (direct children of container)
  // this avoids false positives from nested parent-child overlaps
  for (let i = 0; i < container.children.length; i++) {
    const el = container.children[i] as HTMLElement
    const style = getComputedStyle(el)
    if (style.position !== 'absolute') continue
    const rect = el.getBoundingClientRect()
    // skip full-canvas backgrounds (>80% of container)
    if (rect.left <= cr.left + 5 && rect.top <= cr.top + 5 && rect.width >= cr.width * 0.8 && rect.height >= cr.height * 0.8) continue
    const id = el.getAttribute('data-box-id') || el.tagName.toLowerCase() + (el.textContent?.slice(0, 20) || '')
    items.push({ el, id: `${id}[${Math.round(rect.left)},${Math.round(rect.top)} ${Math.round(rect.width)}x${Math.round(rect.height)}]`, rect })
  }

  const collisions: { a: string; b: string; ra: DOMRect; rb: DOMRect }[] = []
  for (let i = 0; i < items.length; i++) {
    const ai = items[i]
    for (let j = i + 1; j < items.length; j++) {
      const a = ai, b = items[j]
      if (a.rect.left <= b.rect.right && a.rect.right >= b.rect.left && a.rect.top <= b.rect.bottom && a.rect.bottom >= b.rect.top) {
        collisions.push({ a: a.id, b: b.id, ra: a.rect, rb: b.rect })
      }
    }

    // child exceeds parent boundary (direct parent with position:relative/absolute)
    const parent = ai.el.parentElement
    if (parent && parent !== container) {
      const ps = getComputedStyle(parent)
      if (ps.position === 'absolute' || ps.position === 'relative') {
        const pr = parent.getBoundingClientRect()
        if (ai.rect.left + 1 < pr.left || ai.rect.top + 1 < pr.top || ai.rect.right - 1 > pr.right || ai.rect.bottom - 1 > pr.bottom) {
          collisions.push({
            a: `[溢出] ${ai.id}`,
            b: `父容器[${Math.round(pr.left)},${Math.round(pr.top)} ${Math.round(pr.width)}x${Math.round(pr.height)}]`,
            ra: ai.rect,
            rb: pr,
          })
        }
      }
    }
  }
  return collisions
}
