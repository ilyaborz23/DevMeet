import { useRef } from 'react'
import { formatDate, formatTime } from '../utils/format'

interface DateTimeFieldProps {
  id: string
  value: string
  min?: string
  invalid: boolean
  describedBy?: string
  onChange: (value: string) => void
}

// The native datetime-local text follows the browser language (e.g. "дд.мм.гггг").
// We show our own English value and open the native picker on click.
function DateTimeField({ id, value, min, invalid, describedBy, onChange }: DateTimeFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  function openPicker() {
    const input = inputRef.current
    if (!input) return
    try {
      input.showPicker()
    } catch {
      input.focus()
    }
  }

  return (
    <div className="datetime">
      <button
        type="button"
        id={id}
        className="datetime-display"
        aria-invalid={invalid}
        aria-describedby={describedBy}
        onClick={openPicker}
      >
        {value ? (
          <>
            <span className="datetime-date">{formatDate(value)}</span>
            <span className="datetime-time">{formatTime(value)}</span>
          </>
        ) : (
          <span className="datetime-placeholder">Pick date &amp; time</span>
        )}
        <svg className="datetime-icon" viewBox="0 0 20 20" aria-hidden="true">
          <rect x="2.5" y="4" width="15" height="13" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="M2.5 8h15M6.5 2v4M13.5 2v4" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      </button>
      <input
        ref={inputRef}
        type="datetime-local"
        className="datetime-native"
        value={value}
        min={min}
        tabIndex={-1}
        aria-hidden="true"
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}

export default DateTimeField
