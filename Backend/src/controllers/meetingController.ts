import type { Request, Response } from "express";
import { sql } from "../db/connect";
import type { Meeting } from "../types/Meeting";
//getMeetingsByTeam
export const getMeetingsByTeam = async (req: Request, res: Response) => {
    const { teamId } = req.params;
    try {
        const meetings = (await sql`SELECT * FROM meetings WHERE team_id = ${teamId} ORDER BY start_time`) as Meeting[];
        res.json(meetings);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch meetings" });
    }
};
//getMeetingById
export const getMeetingById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const meeting = (await sql`SELECT * FROM meetings WHERE meeting_id = ${id}`) as Meeting[];
        if (meeting.length === 0) {
            res.status(404).json({ error: "Meeting not found" });
        } else {
            res.json(meeting[0]);
        }
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch meeting" });
    }
};
//addMeeting
export const addMeeting = async (req: Request, res: Response) => {
    const { team_id, start_time, end_time, description, room } = req.body;
    if (!team_id || !start_time || !end_time || !description || !room) {
        res.status(400).json({ error: "All fields are required" });
        return;
    }
    if (new Date(start_time) < new Date()) {
        res.status(400).json({ error: "Start time cannot be in the past" });
        return;
    }
    if (new Date(end_time) <= new Date(start_time)) {
        res.status(400).json({ error: "End time must be after start time" });
        return;
    }
    try {
        const [newMeeting] = (await sql`INSERT INTO meetings (team_id, start_time, end_time, description, room) VALUES (${team_id}, ${start_time}, ${end_time}, ${description}, ${room}) RETURNING *`) as Meeting[];
        res.status(201).json(newMeeting);
    } catch (err) {
        res.status(500).json({ error: "Failed to add meeting" });
    }
};
//updateMeeting
export const updateMeeting = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { team_id, start_time, end_time, description, room } = req.body;
    if (!team_id || !start_time || !end_time || !description || !room) {
        res.status(400).json({ error: "All fields are required" });
        return;
    }
    if (new Date(end_time) <= new Date(start_time)) {
        res.status(400).json({ error: "End time must be after start time" });
        return;
    }
    try {
        const [updatedMeeting] = (await sql`UPDATE meetings SET team_id = ${team_id}, start_time = ${start_time}, end_time = ${end_time}, description = ${description}, room = ${room} WHERE meeting_id = ${id} RETURNING *`) as Meeting[];
        if (!updatedMeeting) {
            res.status(404).json({ error: "Meeting not found" });
        } else {
            res.json(updatedMeeting);
        }
    } catch (err) {
        res.status(500).json({ error: "Failed to update meeting" });
    }
};
//deleteMeeting
export const deleteMeeting = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await sql`DELETE FROM meetings WHERE meeting_id = ${id} RETURNING *` as Meeting[];
        if (result.length === 0) {
            res.status(404).json({ error: "Meeting not found" });
        } else {
            res.json({ message: "Meeting deleted successfully" });
        }
    } catch (err) {
        res.status(500).json({ error: "Failed to delete meeting" });
    }
};
