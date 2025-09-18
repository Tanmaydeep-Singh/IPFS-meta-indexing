import { createItem } from "../utils/createItem.js";
import { getFromIPFS } from "../utils/ipfs.js";

export const createTeams = async (req, res) => {
  await createItem(req, res, "teamCID", "Team");
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

