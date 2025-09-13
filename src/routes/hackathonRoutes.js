import express from "express";
import { createHackathon, getHackathons, getHackathonByCID, updateHackathon, deleteHackathon } from "../controllers/hackathonController.js";

const router = express.Router();

router.post("/", createHackathon);      
router.get("/", getHackathons);         
router.get("/:cid", getHackathonByCID); 
router.put("/:id", updateHackathon);
router.delete("/:id", deleteHackathon);


export default router;
