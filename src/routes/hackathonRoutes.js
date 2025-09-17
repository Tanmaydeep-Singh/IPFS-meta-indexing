import express from "express";
import { getHackathons, createHackathon, getHackathonByCID, addVotes } from "../controller/hackathonController.js";

const router = express.Router();

router.get("/", getHackathons);
router.post("/", createHackathon);
router.get("/:cid", getHackathonByCID);
router.post("/votes/:cid", addVotes)

export default router;
