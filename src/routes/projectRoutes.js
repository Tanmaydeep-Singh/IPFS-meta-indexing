import express from "express";
import {
  createProject,
  getProjects,
  getProjectByCID,
  updateProject,
  deleteProject,
  voteProject
} from "../controllers/projectController.js";

const router = express.Router();

router.post("/", createProject);          
router.get("/", getProjects);             
router.get("/:cid", getProjectByCID);     
router.put("/:id", updateProject);        
router.delete("/:id", deleteProject);     

//votes
router.post("/vote/:projectId", voteProject);


export default router;
