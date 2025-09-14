import Teams from "../models/Teams.js";
import Users from "../models/Users.js";
import Hackathon from "../models/Hackathon.js";

// Create a new team
export const createTeam = async (req, res) => {
  try {
    const { name, hackathonId, userId } = req.body;

    // Check hackathon exists
    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) return res.status(404).json({ message: "Hackathon not found" });

    // Check user exists
    const user = await Users.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const team = new Teams({
      name,
      hackathon: hackathonId,
      members: [userId],
      createdBy: userId,
    });

    await team.save();
    res.status(201).json(team);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Join a team
export const joinTeam = async (req, res) => {
  try {
    const { teamId, userId } = req.body;

    const team = await Teams.findById(teamId);
    if (!team) return res.status(404).json({ message: "Team not found" });

    if (team.members.includes(userId)) {
      return res.status(400).json({ message: "User already in team" });
    }

    team.members.push(userId);
    await team.save();

    res.status(200).json(team);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Leave a team
export const leaveTeam = async (req, res) => {
  try {
    const { teamId, userId } = req.body;

    const team = await Teams.findById(teamId);
    if (!team) return res.status(404).json({ message: "Team not found" });

    team.members = team.members.filter((id) => id.toString() !== userId);
    await team.save();

    res.status(200).json({ message: "User removed from team", team });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get teams for a hackathon
export const getHackathonTeams = async (req, res) => {
  try {
    const { hackathonId } = req.params;
    const teams = await Teams.find({ hackathon: hackathonId })
      .populate("members", "name email")
      .populate("project", "title");
    res.status(200).json(teams);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getTeamDetails = async (req, res) => {
  try {
    const { teamId } = req.params;
    const team = await Teams.findById(teamId)
      .populate("members", "name email")
      .populate("project", "title description");
    if (!team) return res.status(404).json({ message: "Team not found" });

    res.status(200).json(team);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
