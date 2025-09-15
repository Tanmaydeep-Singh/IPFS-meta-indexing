import express from "express";
import { getHackathons, createHackathon, getHackathonByCID } from "../controller/hackathonController.js";

const router = express.Router();

router.get("/", getHackathons);
router.post("/", createHackathon);
router.get("/:cid", getHackathonByCID);

export default router;
