import { pinata } from "../config/pinata.js";
import Hackathon from "../models/Hackathon.js";
import Project from "../models/Project.js";
import axios from "axios";
import Teams from "../models/Teams.js";

export const createProject = async (req, res) => {
 try {
    const { title, description, github, cid, teamId, hackathonId } = req.body;

    const team = await Teams.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }


    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) {
      return res.status(404).json({ message: "Hackathon not found" });
    }


    if (team.project) {
      return res.status(400).json({ message: "This team already submitted a project" });
    }

    // Create project
    const project = new Project({
      title,
      description,
      github,
      cid,
      team: team._id,
      hackathon: hackathon._id
    });

    await project.save();

    // Link project to team
    team.project = project._id;
    await team.save();

    res.status(201).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating project" });
  }
};

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate("team");
    res.json(projects);
  } catch (err) {
    console.error("⚠️ Error fetching projects:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getProjectByCID = async (req, res) => {
  try {
    const cid = req.params.cid;
    const response = await axios.get(`https://gateway.pinata.cloud/ipfs/${cid}`);
    res.json({ cid, data: response.data });
  } catch (err) {
    console.error("⚠️ Error fetching project JSON:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, github, cid } = req.body;

    const project = await Project.findByIdAndUpdate(
      id,
      { title, description, github, cid },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating project" });
  }
};


export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    // Find project
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Unlink project from team
    await Team.findByIdAndUpdate(project.team, { $unset: { project: "" } });

    // Delete project
    await Project.findByIdAndDelete(id);

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting project" });
  }
};



export const voteProject = async (req, res) => {
  try {
    const { userId } = req.body;
    const { projectId } = req.params;

    console.log(userId);
    console.log(projectId);

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    console.log(project);

    if (project.votes.includes(userId)) {
      return res.status(400).json({ message: "You already voted for this project" });
    }

    project.votes.push(userId);
    await project.save();

    res.status(200).json({ message: "Vote added successfully", totalVotes: project.votes.length });
  } catch (err) {
    res.status(500).json({ message: "Error voting project", error: err.message });
  }
};
