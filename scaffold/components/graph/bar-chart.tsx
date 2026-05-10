'use client'

import { BarChart as RechartsBar, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { boxStyle } from '@/lib/utils'
import type { Box } from '@/lib/types'

interface BarChartProps extends Box {
  data: { label: string; value: number }[]
  color?: string
}

export function BarChart({ data, color = '#6366F1', ...box }: BarChartProps) {
  return (
    <div style={boxStyle(box)}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBar data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2E3144" />
          <XAxis dataKey="label" stroke="#6B7280" fontSize={12} />
          <YAxis stroke="#6B7280" fontSize={12} />
          <Tooltip
            contentStyle={{ background: '#1A1D2B', border: '1px solid #2E3144', borderRadius: 8 }}
            labelStyle={{ color: '#F1F3F9' }}
          />
          <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} />
        </RechartsBar>
      </ResponsiveContainer>
    </div>
  )
}
