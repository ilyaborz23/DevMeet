import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import type { NewMeeting, Team } from '../types'
import { getMeeting, getTeams, updateMeeting } from '../api'
import { toInputValue } from '../utils/format'
import MeetingForm from '../components/MeetingForm'
import type { MeetingFormValues } from '../components/MeetingForm'

function EditMeetingPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [teams, setTeams] = useState<Team[]>([])
  const [initialValues, setInitialValues] = useState<MeetingFormValues | null>(null)
  const [error, setError] = useState('')

  // Load teams and the current meeting values to prefill the form
  useEffect(() => {
    if (!id) return
    Promise.all([getTeams(), getMeeting(id)])
      .then(([teamsData, meeting]) => {
        setTeams(teamsData)
        setInitialValues({
          team_id: String(meeting.team_id),
          description: meeting.description,
          room: meeting.room,
          start_time: toInputValue(meeting.start_time),
          end_time: toInputValue(meeting.end_time),
        })
      })
      .catch((err: Error) => setError(err.message))
  }, [id])

  async function handleSubmit(meeting: NewMeeting) {
    if (!id) return
    await updateMeeting(id, meeting)
    navigate(`/meetings?team=${meeting.team_id}`)
  }

  return (
    <section className="form-page">
      <header className="page-head">
        <p className="overline">Meeting #{id}</p>
        <h1>Reschedule.</h1>
        <p className="page-intro">Every field is required. Past meetings can be edited too.</p>
      </header>

      {error && (
        <>
          <p className="error" role="alert">{error}</p>
          <Link to="/meetings" className="text-link">← Back to the schedule</Link>
        </>
      )}

      {!error && !initialValues && <p className="loading">Loading meeting…</p>}

      {initialValues && (
        <MeetingForm
          teams={teams}
          initialValues={initialValues}
          allowPastStart
          submitLabel="Save changes"
          onSubmit={handleSubmit}
        />
      )}
    </section>
  )
}

export default EditMeetingPage
