'use client'

import { boxStyle } from '@/lib/utils'
import type { Box } from '@/lib/types'
import NextImage from 'next/image'

type ImageEffect = 'none' | 'shadow-3d' | 'mask-circle' | 'mask-rounded' | 'glow'

interface ImageProps extends Box {
  src: string
  alt?: string
  effect?: ImageEffect
  objectFit?: 'cover' | 'contain' | 'fill'
}

const effectStyle: Record<string, React.CSSProperties> = {
  none: { borderRadius: 0 },
  'mask-circle': { borderRadius: '50%' },
  'mask-rounded': { borderRadius: 16 },
  'shadow-3d': { borderRadius: 12, boxShadow: '0 12px 40px rgba(0,0,0,0.4)', transform: 'rotate(1deg)' },
  glow: { borderRadius: 12, boxShadow: '0 0 30px rgba(99,102,241,0.3)' },
}

export function Image({ src, alt = '', effect = 'none', objectFit = 'cover', ...box }: ImageProps) {
  return (
    <div style={{ ...boxStyle(box), overflow: 'hidden', ...effectStyle[effect] }}>
      <NextImage
        src={src}
        alt={alt}
        fill
        style={{ objectFit, transform: effect === 'shadow-3d' ? 'scale(1.05)' : undefined }}
      />
    </div>
  )
}
