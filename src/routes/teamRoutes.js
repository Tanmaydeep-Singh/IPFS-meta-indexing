import express from "express";
import { createTeams, getTeamByCID } from "../controller/teamsController.js";

const router = express.Router();

router.post("/", createTeams ); // ID
router.get("/:cid", getTeamByCID );

export default router;
