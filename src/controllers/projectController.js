import { pinata } from "../config/pinata.js";
import Hackathon from "../models/Hackathon.js";
import Project from "../models/Project.js";
import axios from "axios";

export const createProject = async (req, res) => {
  try {
    console.log(req.body);
    const { title, description, github, team } = req.body;

    const response = await pinata.post("pinning/pinJSONToIPFS", {
      title,
      description,
      github,
    });

    const { IpfsHash } = response.data;

    const project = new Project({
      title,
      description,
      github,
      team,
      cid: IpfsHash,
    });

    await project.save();

    res.status(201).json({
      message: "✅ Project created successfully",
      project,
    });
  } catch (err) {
    console.error("⚠️ Error creating project:", err?.response?.data || err.message);
    res.status(500).json({ error: "Internal Server Error" });
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
    const { title, description, github } = req.body;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Unpin old CID if exists
    if (project.cid) {
      try {
        await pinata.delete(`/pinning/unpin/${project.cid}`);
      } catch (err) {
        console.warn("⚠️ Failed to unpin old CID:", err?.response?.data || err.message);
      }
    }

    // Upload new data to IPFS
    const response = await pinata.post("pinning/pinJSONToIPFS", {
      title,
      description,
      github,
    });

    const { IpfsHash } = response.data;

    project.title = title || project.title;
    project.description = description || project.description;
    project.github = github || project.github;
    project.cid = IpfsHash;
    project.updatedAt = new Date();

    await project.save();

    res.json({
      message: "✅ Project updated successfully",
      project,
    });
  } catch (err) {
    console.error("⚠️ Error updating project:", err?.response?.data || err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Unpin CID
    if (project.cid) {
      try {
        await pinata.delete(`/pinning/unpin/${project.cid}`);
        console.log(`🗑️ Unpinned CID ${project.cid} from Pinata`);
      } catch (err) {
        console.warn("⚠️ Failed to unpin from Pinata:", err?.response?.data || err.message);
      }
    }

    await Project.findByIdAndDelete(id);

    res.json({ message: "✅ Project deleted successfully" });
  } catch (err) {
    console.error("⚠️ Error deleting project:", err?.response?.data || err.message);
    res.status(500).json({ error: "Internal Server Error" });
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
