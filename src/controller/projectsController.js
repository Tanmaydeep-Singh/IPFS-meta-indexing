import { createItem } from "../utils/createItem.js";
import { getFromIPFS } from "../utils/ipfs.js";

export const createProject = async (req, res) => {
  await createItem(req, res, "projectCID", "Project");
};

export const getProjectByCID = async (req, res) => {
  try {
    const { cid } = req.params;
    const projectData = await getFromIPFS(cid);

    res.status(200).json({
      success: true,
      cid,
      data: projectData,
    });
  } catch (err) {
    console.error("❌ Error fetching project:", err.message);
    res.status(500).json({ error: err.message });
  }
};
