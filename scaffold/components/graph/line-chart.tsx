'use client'

import { LineChart as RechartsLine, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { boxStyle } from '@/lib/utils'
import type { Box } from '@/lib/types'
import { colors, typography } from '@/components/theme'

interface LineChartProps extends Box {
  data: { label: string; value: number }[]
  color?: string
}

export function LineChart({ data, color = colors.brand.secondary, ...box }: LineChartProps) {
  return (
    <div style={boxStyle(box)}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLine data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.surface.border} />
          <XAxis
            dataKey="label"
            stroke={colors.text.dim}
            tick={{ fill: colors.text.dim, fontSize: typography.caption.fontSize }}
          />
          <YAxis
            stroke={colors.text.dim}
            tick={{ fill: colors.text.dim, fontSize: typography.caption.fontSize }}
          />
          <Tooltip
            contentStyle={{ background: colors.surface.card, border: `1px solid ${colors.surface.border}`, borderRadius: 8 }}
            labelStyle={{ color: colors.text.primary }}
          />
          <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={{ fill: color, strokeWidth: 0 }} />
        </RechartsLine>
      </ResponsiveContainer>
    </div>
  )
}
