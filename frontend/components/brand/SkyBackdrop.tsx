import Doodle from './Doodle'

const DOODLES = [
  { name: 'star' as const, top: '12%', left: '8%', color: '#FFC23C', size: 26, rot: -8 },
  { name: 'planet' as const, top: '20%', left: '88%', color: '#F58BB0', size: 40, rot: 0 },
  { name: 'sparkle' as const, top: '38%', left: '15%', color: '#5B8DEF', size: 18, rot: 0 },
  { name: 'star' as const, top: '70%', left: '90%', color: '#9B7BD6', size: 20, rot: 12 },
  { name: 'orbit' as const, top: '78%', left: '6%', color: '#5B8DEF', size: 120, rot: 0 },
  { name: 'sparkle' as const, top: '55%', left: '80%', color: '#FFC23C', size: 16, rot: 0 },
]

export default function SkyBackdrop() {
  return (
    <div className="sky-backdrop" aria-hidden="true">
      {DOODLES.map((d, i) => (
        <span
          key={i}
          className="sky-doodle sky-float"
          style={{ top: d.top, left: d.left, ['--rot' as string]: `${d.rot}deg`, animationDelay: `${i * 0.8}s` }}
        >
          <Doodle name={d.name} color={d.color} style={{ width: d.size, height: d.size, transform: `rotate(${d.rot}deg)` }} />
        </span>
      ))}
    </div>
  )
}
