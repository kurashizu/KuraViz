'use client'

import { boxStyle, cn } from '@/lib/utils'
import type { Box } from '@/lib/types'
import NextImage from 'next/image'

type ImageEffect = 'none' | 'shadow-3d' | 'mask-circle' | 'mask-rounded' | 'glow'

interface ImageProps extends Box {
  src: string
  alt?: string
  effect?: ImageEffect
  objectFit?: 'cover' | 'contain' | 'fill'
}

export function Image({ src, alt = '', effect = 'none', objectFit = 'cover', ...box }: ImageProps) {
  return (
    <div
      style={boxStyle(box)}
      className={cn(
        'overflow-hidden',
        effect === 'mask-circle' && 'rounded-full',
        effect === 'mask-rounded' && 'rounded-2xl',
        effect === 'shadow-3d' && 'rounded-xl shadow-2xl shadow-black/40 rotate-1',
        effect === 'glow' && 'rounded-xl shadow-[0_0_30px_rgba(99,102,241,0.3)]',
      )}
    >
      <NextImage
        src={src}
        alt={alt}
        fill
        style={{ objectFit }}
        className={effect === 'shadow-3d' ? 'scale-105' : undefined}
      />
    </div>
  )
}
