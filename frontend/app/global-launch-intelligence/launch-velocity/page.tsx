'use client'

import { useLaunchVelocity } from '../../../hooks/useIntelligence'
import { IntelCard, Metric, StatusBadge, AlertBanner, IntelSkeleton, IntelError, CHART_COLORS, CHART_AXIS, CHART_GRID, CHART_TOOLTIP_STYLE } from '../../../components/intelligence/IntelComponents'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

export default function LaunchVelocityPage() {
  const { data, isLoading, error, refetch } = useLaunchVelocity()

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--accent)]">Launch Velocity Engine</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="intel-card"><IntelSkeleton rows={2} /></div>
          ))}
        </div>
        <div className="intel-card"><IntelSkeleton rows={6} /></div>
      </div>
    )
  }

  if (error || !data) {
    return <IntelError message={error?.message || 'Failed to load velocity data'} onRetry={() => refetch()} />
  }

  const growthTrend = data.growth_rate_percent > 0 ? 'up' : data.growth_rate_percent < 0 ? 'down' : 'flat'

  return (
    <div className="space-y-4">
      {data.surge_detected && (
        <AlertBanner type="surge" message={`HIGH ACTIVITY PHASE DETECTED — ${data.launches_30d} launches in 30 days exceeds monthly average by >20%`} />
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--accent)]">
          Launch Velocity Engine
        </h2>
        <StatusBadge
          label={data.phase}
          variant={data.surge_detected ? 'yellow' : 'green'}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <IntelCard title="7-Day Launches" status="info">
          <Metric label="Past 7 Days" value={data.launches_7d} size="lg" />
        </IntelCard>

        <IntelCard title="30-Day Launches" status={data.surge_detected ? 'warning' : undefined}>
          <Metric
            label="Past 30 Days"
            value={data.launches_30d}
            size="lg"
            trend={growthTrend}
            trendValue={`${data.growth_rate_percent > 0 ? '+' : ''}${data.growth_rate_percent}%`}
          />
        </IntelCard>

        <IntelCard title="Success Rate" status={data.success_ratio >= 90 ? undefined : data.success_ratio >= 70 ? 'warning' : 'critical'}>
          <Metric label={`Last ${data.total_last_50} launches`} value={`${data.success_ratio}%`} size="lg" />
        </IntelCard>

        <IntelCard title="Growth Rate" status={data.growth_rate_percent > 0 ? undefined : 'warning'}>
          <Metric
            label="vs Previous Month"
            value={`${data.growth_rate_percent > 0 ? '+' : ''}${data.growth_rate_percent}%`}
            size="lg"
            trend={growthTrend}
          />
        </IntelCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <IntelCard title="Upcoming — 7 Days" status="info">
          <Metric label="Scheduled Launches" value={data.upcoming_7d} size="md" />
        </IntelCard>
        <IntelCard title="Upcoming — 30 Days" status="info">
          <Metric label="Scheduled Launches" value={data.upcoming_30d} size="md" />
        </IntelCard>
      </div>

      <IntelCard title="30-Day Launch Timeline" subtitle="Daily launch frequency">
        <div className="h-64 mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.daily_timeline}>
              <defs>
                <linearGradient id="velocityGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_COLORS[0]} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={CHART_COLORS[0]} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} />
              <XAxis
                dataKey="date"
                tick={{ fill: CHART_AXIS, fontSize: 10 }}
                tickFormatter={(d: string) => d.slice(5)}
                axisLine={{ stroke: CHART_GRID }}
              />
              <YAxis
                tick={{ fill: CHART_AXIS, fontSize: 10 }}
                axisLine={{ stroke: CHART_GRID }}
                allowDecimals={false}
              />
              <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
              <Area
                type="monotone"
                dataKey="launches"
                stroke={CHART_COLORS[0]}
                strokeWidth={2}
                fill="url(#velocityGrad)"
                dot={false}
                activeDot={{ r: 4, stroke: CHART_COLORS[0], strokeWidth: 2, fill: '#fff' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </IntelCard>
    </div>
  )
}
