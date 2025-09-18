import { updateListForHackathon, updateMasterWrapper } from "./helper.js";
import { getFromIPFS } from "./ipfs.js";

export const createItem = async (req, res, cidKey, itemName) => {
  try {
    const { hackathonCID } = req.params;
    const newItem = req.body;

    const hackathon = await getFromIPFS(hackathonCID);

    const { itemCID, newHackathonCID, updatedHackathon } = await updateListForHackathon(
      hackathon,
      newItem,
      itemName,
      cidKey
    );


    await updateMasterWrapper(hackathonCID, { ...updatedHackathon, cid: newHackathonCID });

    res.status(201).json({
      message: `✅ ${itemName} created with OCC`,
      itemCID,
      newHackathonCID,
    });
  } catch (err) {
    console.error(`❌ Error creating ${itemName}:`, err.message);
    res.status(500).json({ error: err.message });
  }
};
