import { uploadToIPFS, getFromIPFS } from "../utils/ipfs.js";

export const createProject = async (req, res) => {
  try {
    const newProject = req.body;
    

    const projectCID = await uploadToIPFS(newProject);

    res.status(201).json({
      message: "✅ Project created",
      cid: projectCID,
    });
  } catch (err) {
    console.error("❌ Error creating project:", err.message);
    res.status(500).json({ error: err.message });
  }
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
