import express from "express";
import {
  createTeam,
  joinTeam,
  leaveTeam,
  getHackathonTeams,
  getTeamDetails,
} from "../controllers/teamController.js";

const router = express.Router();

router.post("/", createTeam);
router.post("/join", joinTeam);
router.post("/leave", leaveTeam);
router.get("/hackathon/:hackathonId", getHackathonTeams);
router.get("/:teamId", getTeamDetails);

export default router;
