import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import type { Meeting, Team } from '../types'
import { deleteMeeting, getTeamMeetings, getTeams } from '../api'
import { durationMinutes, formatDate, formatDuration, formatTime, isUpcoming } from '../utils/format'

// The duration ribbon is full at 3 hours
const RIBBON_FULL_MINUTES = 180

function MeetingsPage() {
  const [teams, setTeams] = useState<Team[]>([])
  // ?team=<id> — preselected team (e.g. after adding a meeting)
  const [searchParams] = useSearchParams()
  const [selectedId, setSelectedId] = useState(() => searchParams.get('team') ?? '')
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [loading, setLoading] = useState(selectedId !== '')
  const [error, setError] = useState('')

  // Teams for the Select — loaded from the server
  useEffect(() => {
    getTeams()
      .then(setTeams)
      .catch((err: Error) => setError(err.message))
  }, [])

  function handleSelect(teamId: string) {
    setSelectedId(teamId)
    setMeetings([])
    setError('')
    setLoading(teamId !== '')
  }

  // Meetings of the selected team
  useEffect(() => {
    if (!selectedId) return

    let ignore = false // ignore a stale response if the team was changed meanwhile
    getTeamMeetings(selectedId)
      .then((data) => { if (!ignore) setMeetings(data) })
      .catch((err: Error) => { if (!ignore) setError(err.message) })
      .finally(() => { if (!ignore) setLoading(false) })

    return () => { ignore = true }
  }, [selectedId])

  async function handleDelete(meeting: Meeting) {
    if (!confirm(`Delete the meeting "${meeting.description}"?`)) return

    try {
      await deleteMeeting(meeting.meeting_id)
      setMeetings((prev) => prev.filter((m) => m.meeting_id !== meeting.meeting_id))
    } catch (err) {
      setError((err as Error).message)
    }
  }

  const upcomingCount = meetings.filter((m) => isUpcoming(m.start_time)).length

  return (
    <section className="schedule">
      <header className="schedule-head">
        <p className="overline">Schedule</p>
        <h1 className="schedule-title">
          <label htmlFor="team-select">Meetings of</label>{' '}
          <span className="team-select">
            <select id="team-select" value={selectedId} onChange={(e) => handleSelect(e.target.value)}>
              <option value="">choose a team</option>
              {teams.map((team) => (
                <option key={team.team_id} value={team.team_id}>
                  {team.team_name}
                </option>
              ))}
            </select>
          </span>
        </h1>

        {selectedId && !loading && meetings.length > 0 && (
          <p className="tally">
            <span className="tally-item upcoming">{upcomingCount} upcoming</span>
            <span className="tally-item past">{meetings.length - upcomingCount} past</span>
            <span className="tally-hint">The bar shows the length of each meeting</span>
          </p>
        )}
      </header>

      {error && <p className="error" role="alert">{error}</p>}

      {!selectedId && !error && (
        <p className="empty">Pick a team above to see its timetable.</p>
      )}

      {loading && <p className="loading">Loading the timetable…</p>}

      {!loading && selectedId && meetings.length === 0 && !error && (
        <div className="empty">
          <p>No meetings on this team’s timetable yet.</p>
          <Link to="/add" className="text-link">Book the first one →</Link>
        </div>
      )}

      {meetings.length > 0 && (
        <ol className="timetable">
          {meetings.map((meeting, index) => {
            const upcoming = isUpcoming(meeting.start_time)
            const minutes = durationMinutes(meeting.start_time, meeting.end_time)
            const fill = Math.min(minutes / RIBBON_FULL_MINUTES, 1)
            return (
              <li
                key={meeting.meeting_id}
                className={`slot ${upcoming ? 'upcoming' : 'past'}`}
                style={{ '--i': index } as CSSProperties}
              >
                <div className="slot-time">
                  <time className="slot-clock" dateTime={meeting.start_time}>
                    {formatTime(meeting.start_time)}
                  </time>
                  <span className="slot-date">{formatDate(meeting.start_time)}</span>
                </div>

                <div className="slot-body">
                  <span className="slot-status">{upcoming ? 'Upcoming' : 'Past'}</span>
                  <h2 className="slot-title">{meeting.description}</h2>
                  <p className="slot-meta">
                    {meeting.room}
                    <span aria-hidden="true"> · </span>
                    {formatTime(meeting.start_time)}–{formatTime(meeting.end_time)}
                  </p>
                </div>

                <div className="slot-duration">
                  <span className="slot-duration-value">{formatDuration(meeting.start_time, meeting.end_time)}</span>
                  <span className="ribbon" aria-hidden="true">
                    <span className="ribbon-fill" style={{ '--fill': fill } as CSSProperties} />
                  </span>
                </div>

                <div className="slot-actions">
                  <Link to={`/edit/${meeting.meeting_id}`} className="action">Edit</Link>
                  <button type="button" className="action action-danger" onClick={() => handleDelete(meeting)}>
                    Delete
                  </button>
                </div>
              </li>
            )
          })}
        </ol>
      )}
    </section>
  )
}

export default MeetingsPage
