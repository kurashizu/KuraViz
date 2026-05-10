'use client'

import { LineChart as RechartsLine, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { boxStyle } from '@/lib/utils'
import type { Box } from '@/lib/types'

interface LineChartProps extends Box {
  data: { label: string; value: number }[]
  color?: string
}

export function LineChart({ data, color = '#06B6D4', ...box }: LineChartProps) {
  return (
    <div style={boxStyle(box)}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLine data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2E3144" />
          <XAxis dataKey="label" stroke="#6B7280" fontSize={12} />
          <YAxis stroke="#6B7280" fontSize={12} />
          <Tooltip
            contentStyle={{ background: '#1A1D2B', border: '1px solid #2E3144', borderRadius: 8 }}
            labelStyle={{ color: '#F1F3F9' }}
          />
          <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={{ fill: color, strokeWidth: 0 }} />
        </RechartsLine>
      </ResponsiveContainer>
    </div>
  )
}
