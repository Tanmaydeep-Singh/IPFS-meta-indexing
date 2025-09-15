import express from "express";
import { createProject, getProjectByCID } from "../controller/projectsController.js";

const router = express.Router();

router.post("/", createProject); // ID
router.get("/:cid", getProjectByCID);

export default router;
