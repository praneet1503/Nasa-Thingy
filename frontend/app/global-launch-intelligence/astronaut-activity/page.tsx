'use client'

import { useAstronautActivity } from '../../../hooks/useIntelligence'
import { IntelCard, Metric, IndexGauge, IntelSkeleton, IntelError, CHART_COLORS, CHART_AXIS, CHART_GRID, CHART_TOOLTIP_STYLE } from '../../../components/intelligence/IntelComponents'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'

const AGENCY_COLORS = CHART_COLORS

export default function AstronautActivityPage() {
  const { data, isLoading, error, refetch } = useAstronautActivity()

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--accent)]">Astronaut Operations</h2>
        <IntelSkeleton rows={8} />
      </div>
    )
  }

  if (error || !data) {
    return <IntelError message={error?.message || 'Failed to load astronaut data'} onRetry={() => refetch()} />
  }

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--accent)]">
        Astronaut &amp; Crew Intelligence
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <IntelCard title="Active Astronauts">
          <Metric label="In active service" value={data.total_active} size="lg" />
        </IntelCard>
        <IntelCard title="Agencies Represented" status="info">
          <Metric label="Space agencies" value={data.agency_breakdown.length} size="lg" />
        </IntelCard>
        <IntelCard title="Upcoming Crewed" status="info">
          <Metric label="Scheduled missions" value={data.upcoming_crewed_missions.length} size="lg" />
        </IntelCard>
        <IntelCard title="Human Activity Index">
          <IndexGauge label="Activity Intensity" value={data.human_activity_index} icon="☆" />
        </IntelCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <IntelCard title="Agency Representation">
          <div className="h-72 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.agency_breakdown} layout="vertical" barCategoryGap="18%">
                <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} horizontal={false} />
                <XAxis type="number" tick={{ fill: CHART_AXIS, fontSize: 10 }} axisLine={{ stroke: CHART_GRID }} />
                <YAxis
                  dataKey="agency"
                  type="category"
                  width={120}
                  tick={{ fill: CHART_AXIS, fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {data.agency_breakdown.map((_, i) => (
                    <Cell key={i} fill={AGENCY_COLORS[i % AGENCY_COLORS.length]} fillOpacity={0.85} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </IntelCard>

        <IntelCard title="Crewed Launch Timeline">
          {data.upcoming_crewed_missions.length === 0 ? (
            <p className="text-xs text-[var(--text-muted)] py-4">No upcoming crewed missions in current data window</p>
          ) : (
            <div className="space-y-3 mt-2 max-h-72 overflow-y-auto pr-1">
              {data.upcoming_crewed_missions.map((mission, i) => (
                <div key={i} className="flex gap-3 items-start p-2 rounded-lg bg-[var(--cream-sunk)] border border-[var(--border)]/50">
                  <div className="w-8 h-8 rounded-full bg-[var(--accent)]/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-[var(--accent)] text-[10px] font-semibold">LA</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-[var(--text-primary)] truncate">{mission.name}</p>
                    <p className="text-[10px] text-[var(--text-muted)] mt-0.5">{mission.provider} • {mission.pad}</p>
                    {mission.net && (
                      <p className="text-[10px] font-mono text-[var(--accent)] mt-0.5">
                        NET: {new Date(mission.net).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </IntelCard>
      </div>

      <IntelCard title="Active Astronaut Roster">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-2 max-h-96 overflow-y-auto pr-1">
          {data.astronauts.map((astro, i) => (
            <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-[var(--cream-sunk)] border border-[var(--border)]/50">
              <div className="w-8 h-8 rounded-full bg-[rgba(91,141,239,0.12)] flex items-center justify-center flex-shrink-0 overflow-hidden">
                {astro.profile_image ? (
                  <img src={astro.profile_image} alt="" className="w-full h-full object-cover rounded-full" />
                ) : (
                  <span className="text-[9px] text-[var(--text-muted)] font-semibold">AST</span>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-medium text-[var(--text-primary)] truncate">{astro.name}</p>
                <p className="text-[9px] text-[var(--text-muted)]">{astro.agency} • {astro.nationality} • {astro.flights_count} flights</p>
              </div>
            </div>
          ))}
        </div>
      </IntelCard>
    </div>
  )
}
