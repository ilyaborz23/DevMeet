import "dotenv/config";
import express from "express";
import cors from "cors";
import teamRoutes from "./routes/teamRoutes";

const app = express();
const PORT = Number(process.env.PORT) || 3002;

app.use(cors());
app.use(express.json());

app.use("/api/teams", teamRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
