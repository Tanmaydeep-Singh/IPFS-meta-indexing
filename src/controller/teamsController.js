import { uploadToIPFS, getFromIPFS } from "../utils/ipfs.js";

export const createTeams = async (req, res) => {
  try {
    const newTeam = req.body;
    

    const teamCID = await uploadToIPFS(newTeam);

    res.status(201).json({
      message: "✅ Team created",
      cid: teamCID,
    });
  } catch (err) {
    console.error("❌ Error creating team:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const getTeamByCID = async (req, res) => {
  try {
    const { cid } = req.params;
    const teamData = await getFromIPFS(cid);

    res.status(200).json({
      success: true,
      cid,
      data: teamData,
    });
  } catch (err) {
    console.error("❌ Error fetching team:", err.message);
    res.status(500).json({ error: err.message });
  }
};
