import Mascot from './brand/Mascot'

type LoadingStateProps = { label?: string }

export default function LoadingState({ label = 'Loading the cosmos…' }: LoadingStateProps) {
  return (
    <div className="loading-panel">
      <Mascot size={56} expression="read" bob aria-hidden />
      <div className="loading-panel__copy">
        <span className="loading-panel__eyebrow">hang tight</span>
        <p className="loading-panel__title">{label}</p>
        <p className="loading-panel__body">Nova is fetching fresh space data for you…</p>
      </div>
    </div>
  )
}
