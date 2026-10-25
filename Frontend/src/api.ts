import type { Meeting, NewMeeting, Team } from './types'

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  let res: Response
  try {
    res = await fetch(url, options)
  } catch {
    throw new Error('Cannot reach the server. Please check your connection and try again.')
  }

  // The body may be missing or not JSON (e.g. the proxy fails when the server is down)
  const data = await res.json().catch(() => null)

  if (!res.ok) {
    if (data?.error) throw new Error(data.error)
    if (res.status >= 500) throw new Error('The server is unavailable. Please try again later.')
    throw new Error(`Request failed (${res.status})`)
  }
  return data as T
}

export function getTeams() {
  return request<Team[]>('/api/teams')
}

export function getTeamMeetings(teamId: string) {
  return request<Meeting[]>(`/api/meetings/by-team/${teamId}`)
}

export function getMeeting(meetingId: string) {
  return request<Meeting>(`/api/meetings/${meetingId}`)
}

export function createMeeting(meeting: NewMeeting) {
  return request<Meeting>('/api/meetings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(meeting),
  })
}

export function updateMeeting(meetingId: string, meeting: NewMeeting) {
  return request<Meeting>(`/api/meetings/${meetingId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(meeting),
  })
}

export function deleteMeeting(meetingId: number) {
  return request<{ message: string }>(`/api/meetings/${meetingId}`, { method: 'DELETE' })
}
