'use client'

import { motion } from 'framer-motion'
import { boxStyle } from '@/lib/utils'
import type { Box } from '@/lib/types'

type AnimType = 'fade-in' | 'slide-left' | 'slide-right' | 'slide-up' | 'slide-down' | 'scale-in'

interface AnimProps extends Box {
  type?: AnimType
  delay?: number
  duration?: number
  children: React.ReactNode
}

function getAnimProps(type: AnimType) {
  switch (type) {
    case 'fade-in': return { initial: { opacity: 0 }, animate: { opacity: 1 } }
    case 'slide-left': return { initial: { opacity: 0, x: -60 }, animate: { opacity: 1, x: 0 } }
    case 'slide-right': return { initial: { opacity: 0, x: 60 }, animate: { opacity: 1, x: 0 } }
    case 'slide-up': return { initial: { opacity: 0, y: 60 }, animate: { opacity: 1, y: 0 } }
    case 'slide-down': return { initial: { opacity: 0, y: -60 }, animate: { opacity: 1, y: 0 } }
    case 'scale-in': return { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 } }
  }
}

export function Anim({ type = 'fade-in', delay = 0, duration = 0.5, children, ...box }: AnimProps) {
  return (
    <motion.div
      style={boxStyle(box)}
      transition={{ duration, delay: delay / 1000, ease: 'easeOut' }}
      {...getAnimProps(type)}
    >
      {children}
    </motion.div>
  )
}
