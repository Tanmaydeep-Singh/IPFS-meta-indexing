import express from "express";
import { createProject, getProjectByCID } from "../controller/projectsController.js";

const router = express.Router();

router.post("/:hackathonCID", createProject); // ID
router.get("/:cid", getProjectByCID);

export default router;
