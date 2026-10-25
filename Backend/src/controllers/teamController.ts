import type { Request, Response } from "express";
import { sql } from "../db/connect";
import type { Team } from "../types/Team";

export const getAllTeams = async (req: Request, res: Response) => {
    try {
        const teams = (await sql`SELECT * FROM teams`) as Team[];
        res.json(teams);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch teams" });    
    }    
};
