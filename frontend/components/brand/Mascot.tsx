type Expression = 'read' | 'wave' | 'sleep'

type MascotProps = {
  size?: number
  expression?: Expression
  className?: string
  bob?: boolean
  'aria-hidden'?: boolean
}

export default function Mascot({ size = 160, expression = 'read', className = '', bob = false, ...rest }: MascotProps) {
  const s = size
  return (
    <svg
      width={s} height={s} viewBox="0 0 200 200"
      className={`${bob ? 'nova-bob' : ''} ${className}`}
      role="img" aria-label={rest['aria-hidden'] ? undefined : 'Nova, the Nasapedia planet'}
      aria-hidden={rest['aria-hidden']}
    >
      {/* ring behind */}
      <ellipse cx="100" cy="108" rx="92" ry="26" fill="none" stroke="#FFC23C" strokeWidth="9" transform="rotate(-18 100 108)" />
      {/* planet body */}
      <circle cx="100" cy="92" r="58" fill="#4A90D9" />
      <circle cx="100" cy="92" r="58" fill="url(#novaShade)" />
      {/* ring front (over body) */}
      <path d="M 22 118 A 92 26 -18 0 0 178 96" fill="none" stroke="#FFC23C" strokeWidth="9" strokeLinecap="round" />
      {/* face */}
      {expression !== 'sleep' ? (
        <>
          <ellipse cx="84" cy="86" rx="7" ry="9" fill="#11194a" />
          <ellipse cx="116" cy="86" rx="7" ry="9" fill="#11194a" />
          <circle cx="86" cy="83" r="2.4" fill="#fff" />
          <circle cx="118" cy="83" r="2.4" fill="#fff" />
        </>
      ) : (
        <>
          <path d="M77 86 q7 6 14 0" stroke="#11194a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <path d="M109 86 q7 6 14 0" stroke="#11194a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        </>
      )}
      <ellipse cx="76" cy="102" rx="7" ry="4" fill="#f7a8c4" opacity="0.85" />
      <ellipse cx="124" cy="102" rx="7" ry="4" fill="#f7a8c4" opacity="0.85" />
      <path d="M92 104 q8 8 16 0" stroke="#11194a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      {/* book (read expression) */}
      {expression === 'read' && (
        <g>
          <rect x="64" y="120" width="72" height="30" rx="4" fill="#1b2a6b" />
          <rect x="69" y="125" width="62" height="20" rx="2" fill="#f4e6c8" />
          <text x="100" y="141" textAnchor="middle" fontFamily="var(--font-fredoka), sans-serif" fontWeight="700" fontSize="15" fill="#1b2a6b">N</text>
        </g>
      )}
      {expression === 'wave' && (
        <circle cx="150" cy="120" r="11" fill="#4A90D9" />
      )}
      <defs>
        <radialGradient id="novaShade" cx="38%" cy="32%" r="72%">
          <stop offset="0%" stopColor="#7fb0ec" />
          <stop offset="70%" stopColor="#4A90D9" />
          <stop offset="100%" stopColor="#3a7cc4" />
        </radialGradient>
      </defs>
    </svg>
  )
}
