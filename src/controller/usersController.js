import { uploadToIPFS, getFromIPFS } from "../utils/ipfs.js";

export const createUser = async (req, res) => {
  try {
    const newUser = req.body;
    

    const userCID = await uploadToIPFS(newUser);

    res.status(201).json({
      message: "✅ User created",
      cid: userCID,
    });
  } catch (err) {
    console.error("❌ Error creating user:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const getUserByCID = async (req, res) => {
  try {
    const { cid } = req.params;
    const userData = await getFromIPFS(cid);

    res.status(200).json({
      success: true,
      cid,
      data: userData,
    });
  } catch (err) {
    console.error("❌ Error fetching User:", err.message);
    res.status(500).json({ error: err.message });
  }
};
