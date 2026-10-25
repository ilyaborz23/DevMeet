export interface Team {
  team_id: number
  team_name: string
}

export interface Meeting {
  meeting_id: number
  team_id: number
  start_time: string
  end_time: string
  description: string
  room: string
}

export type NewMeeting = Omit<Meeting, 'meeting_id'>
