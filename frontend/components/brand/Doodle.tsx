type DoodleName = 'star' | 'sparkle' | 'orbit' | 'underline' | 'shooting-star' | 'planet'

type DoodleProps = {
  name: DoodleName
  className?: string
  style?: React.CSSProperties
  color?: string
}

export default function Doodle({ name, className = '', style, color = 'currentColor' }: DoodleProps) {
  const common = { 'aria-hidden': true as const, className, style, fill: color }
  switch (name) {
    case 'star':
      return (
        <svg {...common} width="24" height="24" viewBox="0 0 24 24">
          <path d="M12 2l2.4 6.6L21 9l-5 4.3L17.5 21 12 17l-5.5 4 1.5-7.7L3 9l6.6-.4z" />
        </svg>
      )
    case 'sparkle':
      return (
        <svg {...common} width="20" height="20" viewBox="0 0 24 24">
          <path d="M12 0c.6 5.4 2.6 7.4 8 8-5.4.6-7.4 2.6-8 8-.6-5.4-2.6-7.4-8-8 5.4-.6 7.4-2.6 8-8z" />
        </svg>
      )
    case 'planet':
      return (
        <svg {...common} width="28" height="28" viewBox="0 0 28 28" fill="none">
          <circle cx="14" cy="14" r="8" fill={color} />
          <ellipse cx="14" cy="15" rx="13" ry="4" stroke={color} strokeWidth="2.2" fill="none" transform="rotate(-18 14 15)" />
        </svg>
      )
    case 'orbit':
      return (
        <svg {...common} width="120" height="40" viewBox="0 0 120 40" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round">
          <path d="M4 30 C 40 6, 80 6, 116 26" strokeDasharray="2 8" />
        </svg>
      )
    case 'shooting-star':
      return (
        <svg {...common} width="80" height="40" viewBox="0 0 80 40" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round">
          <path d="M6 34 L 52 8" />
          <path d="M22 33 L 40 22" opacity="0.6" />
          <path d="M58 6l1.6 4.2L64 11l-3.2 2.8L62 18l-4-2.6L54 18l1.1-4.9L52 11l4.2-.3z" fill={color} stroke="none" />
        </svg>
      )
    case 'underline':
      return (
        <svg {...common} width="280" height="14" viewBox="0 0 280 14" preserveAspectRatio="none" fill="none">
          <path d="M3 8 C 70 2, 150 12, 277 5" stroke={color} strokeWidth="5" strokeLinecap="round" />
        </svg>
      )
  }
}
