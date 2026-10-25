// "09:30"
export function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

// "Tue, 3 Nov 2026"
export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function durationMinutes(startIso: string, endIso: string) {
  return Math.round((new Date(endIso).getTime() - new Date(startIso).getTime()) / 60000)
}

// Meeting duration, e.g. "1 h 30 min"
export function formatDuration(startIso: string, endIso: string) {
  const minutes = durationMinutes(startIso, endIso)
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m} min`
  if (m === 0) return `${h} h`
  return `${h} h ${m} min`
}

// ISO (UTC) → value for <input type="datetime-local"> in local time
export function toInputValue(iso: string) {
  const date = new Date(iso)
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
  return date.toISOString().slice(0, 16)
}

export function isUpcoming(startIso: string) {
  return new Date(startIso).getTime() > Date.now()
}
