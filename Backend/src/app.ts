import "dotenv/config";
import express from "express";
import cors from "cors";
import { sql } from "./db/connect";


const app = express();
const PORT = Number(process.env.PORT) || 3002;

app.use(cors());
app.use(express.json());

app.get("/db", async (_req, res) => {
  try {
    const teams = await sql`SELECT * FROM teams`;
    res.json(teams);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
