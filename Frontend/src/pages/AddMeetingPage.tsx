import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { NewMeeting, Team } from '../types'
import { createMeeting, getTeams } from '../api'
import MeetingForm from '../components/MeetingForm'
import type { MeetingFormValues } from '../components/MeetingForm'

const emptyForm: MeetingFormValues = { team_id: '', description: '', room: '', start_time: '', end_time: '' }

function AddMeetingPage() {
  const navigate = useNavigate()
  const [teams, setTeams] = useState<Team[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    getTeams()
      .then(setTeams)
      .catch((err: Error) => setError(err.message))
  }, [])

  async function handleSubmit(meeting: NewMeeting) {
    await createMeeting(meeting)
    // The meetings page reloads the list of this team, including the new meeting
    navigate(`/meetings?team=${meeting.team_id}`)
  }

  return (
    <section className="form-page">
      <header className="page-head">
        <p className="overline">New meeting</p>
        <h1>Book a slot.</h1>
        <p className="page-intro">Every field is required. A new meeting cannot start in the past.</p>
      </header>

      {error && <p className="error" role="alert">{error}</p>}

      <MeetingForm
        teams={teams}
        initialValues={emptyForm}
        allowPastStart={false}
        submitLabel="Add to schedule"
        onSubmit={handleSubmit}
      />
    </section>
  )
}

export default AddMeetingPage
