import Mascot from './brand/Mascot'

type EmptyStateProps = {
  title?: string
  body?: string
  expression?: 'sleep' | 'wave' | 'read'
  children?: React.ReactNode
}

export default function EmptyState({
  title = 'Nothing out here yet',
  body = 'Try a different search or check back soon.',
  expression = 'sleep',
  children,
}: EmptyStateProps) {
  return (
    <div className="surface-panel surface-panel--empty" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
        <Mascot size={84} expression={expression} aria-hidden />
      </div>
      <h3 className="section-title" style={{ marginBottom: '0.35rem' }}>{title}</h3>
      <p className="section-meta" style={{ maxWidth: '40ch', margin: '0 auto' }}>{body}</p>
      {children ? <div style={{ marginTop: '1rem' }}>{children}</div> : null}
    </div>
  )
}
