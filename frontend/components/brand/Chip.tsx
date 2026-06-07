type ChipProps = {
  active?: boolean
  gold?: boolean
  onClick?: () => void
  children: React.ReactNode
}

export default function Chip({ active, gold, onClick, children }: ChipProps) {
  const classes = ['chip', active ? 'chip--active' : '', gold ? 'chip--gold' : ''].filter(Boolean).join(' ')
  return (
    <button type="button" className={classes} onClick={onClick} aria-pressed={active}>
      {children}
    </button>
  )
}
