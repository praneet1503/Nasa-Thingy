import Link from 'next/link'

type Variant = 'primary' | 'gold' | 'plain'
type CommonProps = { variant?: Variant; className?: string; children: React.ReactNode }

function cls(variant: Variant, extra = '') {
  const base = 'space-btn'
  const v = variant === 'primary' ? 'space-btn-primary' : variant === 'gold' ? 'space-btn-gold' : ''
  return `${base} ${v} ${extra}`.trim()
}

export function ButtonLink({ href, variant = 'primary', className, children }: CommonProps & { href: string }) {
  return <Link href={href} className={cls(variant, className)}>{children}</Link>
}

export default function Button({
  variant = 'primary', className, children, ...rest
}: CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={cls(variant, className)} {...rest}>{children}</button>
}
