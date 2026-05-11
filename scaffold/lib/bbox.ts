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
  const allPos: { el: HTMLElement; id: string; rect: DOMRect }[] = []
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT)
  let node: Node | null
  while ((node = walker.nextNode())) {
    const el = node as HTMLElement
    if (getComputedStyle(el).position !== 'absolute') continue
    const rect = el.getBoundingClientRect()
    if (rect.left <= cr.left + 5 && rect.top <= cr.top + 5 && rect.width >= cr.width * 0.8 && rect.height >= cr.height * 0.8) continue
    const id = el.getAttribute('data-box-id') || el.tagName.toLowerCase() + (el.textContent?.slice(0, 20) || '')
    allPos.push({ el, id: `${id}[${Math.round(rect.left)},${Math.round(rect.top)} ${Math.round(rect.width)}x${Math.round(rect.height)}]`, rect })
  }

  const collisions: { a: string; b: string; ra: DOMRect; rb: DOMRect }[] = []

  // sibling overlap: only check direct children of container (top-level blocks)
  for (let i = 0; i < container.children.length; i++) {
    const el = container.children[i] as HTMLElement
    if (getComputedStyle(el).position !== 'absolute') continue
    const ri = el.getBoundingClientRect()
    if (ri.left <= cr.left + 5 && ri.top <= cr.top + 5 && ri.width >= cr.width * 0.8) continue
    for (let j = i + 1; j < container.children.length; j++) {
      const el2 = container.children[j] as HTMLElement
      if (getComputedStyle(el2).position !== 'absolute') continue
      const rj = el2.getBoundingClientRect()
      if (rj.left <= cr.left + 5 && rj.top <= cr.top + 5 && rj.width >= cr.width * 0.8) continue
      if (ri.left < rj.right - 1 && ri.right > rj.left + 1 && ri.top < rj.bottom - 1 && ri.bottom > rj.top + 1) {
        const id1 = el.getAttribute('data-box-id') || el.tagName.toLowerCase() + (el.textContent?.slice(0, 20) || '')
        const id2 = el2.getAttribute('data-box-id') || el2.tagName.toLowerCase() + (el2.textContent?.slice(0, 20) || '')
        collisions.push({ a: `OVERLAP ${id1}[${Math.round(ri.left)},${Math.round(ri.top)} ${Math.round(ri.width)}x${Math.round(ri.height)}]`, b: `${id2}[${Math.round(rj.left)},${Math.round(rj.top)} ${Math.round(rj.width)}x${Math.round(rj.height)}]`, ra: ri, rb: rj })
      }
    }
  }

  // overflow: every absolutely-positioned element must stay within its positioned parent
  for (const item of allPos) {
    // skip KaTeX rendering artifacts (1x1px helper spans)
    if (item.rect.width < 3 && item.rect.height < 3) continue
    let parent: HTMLElement | null = item.el.parentElement
    while (parent && parent !== container) {
      const ps = getComputedStyle(parent)
      if (ps.position === 'absolute' || ps.position === 'relative') {
        const pr = parent.getBoundingClientRect()
        if (pr.width === 0 || pr.height === 0) break // positioning wrapper, skip
        if (item.rect.left + 0.5 < pr.left || item.rect.top + 0.5 < pr.top || item.rect.right - 0.5 > pr.right || item.rect.bottom - 0.5 > pr.bottom) {
          const parentId = parent.getAttribute('data-box-id') || parent.tagName.toLowerCase() + (parent.textContent?.slice(0, 20) || '')
          collisions.push({
            a: `OVERFLOW ${item.id}`,
            b: `${parentId}[${Math.round(pr.left)},${Math.round(pr.top)} ${Math.round(pr.width)}x${Math.round(pr.height)}]`,
            ra: item.rect,
            rb: pr,
          })
        }
        break
      }
      parent = parent.parentElement
    }
  }

  // content overflow: elements with overflow:hidden whose content exceeds their box
  for (const item of allPos) {
    if (item.rect.width < 3 && item.rect.height < 3) continue
    const el = item.el
    const cs = getComputedStyle(el)
    if (cs.overflow === 'hidden' || cs.overflowX === 'hidden' || cs.overflowY === 'hidden') {
      if (el.scrollHeight > el.clientHeight || el.scrollWidth > el.clientWidth) {
        const dh = el.scrollHeight - el.clientHeight
        const dw = el.scrollWidth - el.clientWidth
        collisions.push({
          a: `CONTENT_OVERFLOW ${item.id}`,
          b: `overflows by ${Math.max(dh, dw)}px (scroll=${el.scrollHeight}x${el.scrollWidth}, client=${el.clientHeight}x${el.clientWidth})`,
          ra: el.getBoundingClientRect(),
          rb: el.getBoundingClientRect(),
        })
      }
    }
  }

  // canvas overflow: every absolutely-positioned element must stay within canvas (container)
  for (const item of allPos) {
    if (item.rect.left + 0.5 < cr.left || item.rect.top + 0.5 < cr.top ||
        item.rect.right - 0.5 > cr.right || item.rect.bottom - 0.5 > cr.bottom) {
      collisions.push({
        a: `EXCEED ${item.id}`,
        b: `canvas[${Math.round(cr.left)},${Math.round(cr.top)} ${Math.round(cr.width)}x${Math.round(cr.height)}]`,
        ra: item.rect,
        rb: cr,
      })
    }
  }

  return collisions
}
