import { useState } from 'react'
import type { SubmitEvent } from 'react'
import type { NewMeeting, Team } from '../types'
import { formatDuration } from '../utils/format'
import DateTimeField from './DateTimeField'

export interface MeetingFormValues {
  team_id: string
  description: string
  room: string
  start_time: string
  end_time: string
}

type FormErrors = Partial<Record<keyof MeetingFormValues, string>>

// datetime-local gives local time without a timezone — new Date parses it as local time
function validate(values: MeetingFormValues, allowPastStart: boolean): FormErrors {
  const errors: FormErrors = {}

  if (!values.team_id) errors.team_id = 'Select a development team'
  if (!values.description.trim()) errors.description = 'Describe what the meeting is about'
  if (!values.room.trim()) errors.room = 'Enter a room'

  const start = new Date(values.start_time)
  const end = new Date(values.end_time)

  if (!values.start_time) {
    errors.start_time = 'Pick a start time'
  } else if (!allowPastStart && start < new Date()) {
    errors.start_time = 'A new meeting cannot start in the past'
  }

  if (!values.end_time) {
    errors.end_time = 'Pick an end time'
  } else if (values.start_time && end <= start) {
    errors.end_time = 'The meeting must end after it starts'
  }

  return errors
}

// Current local time in datetime-local format: "2026-10-25T15:30"
function nowForInput() {
  const now = new Date()
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
  return now.toISOString().slice(0, 16)
}

interface MeetingFormProps {
  teams: Team[]
  initialValues: MeetingFormValues
  allowPastStart: boolean
  submitLabel: string
  onSubmit: (meeting: NewMeeting) => Promise<void>
}

function MeetingForm({ teams, initialValues, allowPastStart, submitLabel, onSubmit }: MeetingFormProps) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState<FormErrors>({})
  const [serverError, setServerError] = useState('')
  const [saving, setSaving] = useState(false)

  function handleChange(field: keyof MeetingFormValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    setServerError('')

    const validationErrors = validate(values, allowPastStart)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setSaving(true)
    try {
      // Times are sent as local "YYYY-MM-DDTHH:mm" — the database column has no timezone
      await onSubmit({
        team_id: Number(values.team_id),
        description: values.description.trim(),
        room: values.room.trim(),
        start_time: values.start_time,
        end_time: values.end_time,
      })
    } catch (err) {
      setServerError((err as Error).message)
      setSaving(false)
    }
  }

  // Props for a field with an inline error linked via aria-describedby
  const fieldProps = (field: keyof MeetingFormValues) => ({
    id: field,
    value: values[field],
    'aria-invalid': !!errors[field],
    'aria-describedby': errors[field] ? `${field}-error` : undefined,
  })

  const fieldError = (field: keyof MeetingFormValues) =>
    errors[field] && <p id={`${field}-error`} className="field-error">{errors[field]}</p>

  const validRange =
    values.start_time && values.end_time && new Date(values.end_time) > new Date(values.start_time)

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label htmlFor="team_id">Team</label>
        <select {...fieldProps('team_id')} onChange={(e) => handleChange('team_id', e.target.value)}>
          <option value="">Select a team</option>
          {teams.map((team) => (
            <option key={team.team_id} value={team.team_id}>{team.team_name}</option>
          ))}
        </select>
        {fieldError('team_id')}
      </div>

      <div className="field">
        <label htmlFor="description">What is it about?</label>
        <textarea
          {...fieldProps('description')}
          rows={3}
          placeholder="Sprint planning for the checkout redesign"
          onChange={(e) => handleChange('description', e.target.value)}
        />
        {fieldError('description')}
      </div>

      <div className="field">
        <label htmlFor="room">Room</label>
        <input
          {...fieldProps('room')}
          type="text"
          placeholder="Blue Room"
          onChange={(e) => handleChange('room', e.target.value)}
        />
        {fieldError('room')}
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="start_time">Starts</label>
          <DateTimeField
            id="start_time"
            value={values.start_time}
            min={allowPastStart ? undefined : nowForInput()}
            invalid={!!errors.start_time}
            describedBy={errors.start_time ? 'start_time-error' : undefined}
            onChange={(value) => handleChange('start_time', value)}
          />
          {fieldError('start_time')}
        </div>

        <div className="field">
          <label htmlFor="end_time">Ends</label>
          <DateTimeField
            id="end_time"
            value={values.end_time}
            min={values.start_time || undefined}
            invalid={!!errors.end_time}
            describedBy={errors.end_time ? 'end_time-error' : undefined}
            onChange={(value) => handleChange('end_time', value)}
          />
          {fieldError('end_time')}
        </div>
      </div>

      <p className="form-duration" aria-live="polite">
        {validRange ? (
          <>Duration <strong>{formatDuration(values.start_time, values.end_time)}</strong></>
        ) : (
          'Duration appears once both times are set'
        )}
      </p>

      {serverError && <p className="error" role="alert">{serverError}</p>}

      <button type="submit" className="button" disabled={saving}>
        {saving ? 'Saving…' : submitLabel} <span aria-hidden="true">→</span>
      </button>
    </form>
  )
}

export default MeetingForm
