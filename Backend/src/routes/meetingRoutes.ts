import express from "express";
import {
    getMeetingsByTeam,
    getMeetingById,
    addMeeting,
    updateMeeting,
    deleteMeeting,
} from "../controllers/meetingController";

const router = express.Router();

router.get("/by-team/:teamId", getMeetingsByTeam);
router.get("/:id", getMeetingById);
router.post("/", addMeeting);
router.put("/:id", updateMeeting);
router.delete("/:id", deleteMeeting);

export default router;
