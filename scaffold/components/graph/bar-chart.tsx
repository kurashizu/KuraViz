'use client'

import { BarChart as RechartsBar, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { boxStyle } from '@/lib/utils'
import type { Box } from '@/lib/types'
import { colors, typography } from '@/components/theme'

interface BarChartProps extends Box {
  data: { label: string; value: number }[]
  color?: string
}

export function BarChart({ data, color = colors.brand.primary, ...box }: BarChartProps) {
  return (
    <div style={boxStyle(box)}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBar data={data}>
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
          <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} />
        </RechartsBar>
      </ResponsiveContainer>
    </div>
  )
}
