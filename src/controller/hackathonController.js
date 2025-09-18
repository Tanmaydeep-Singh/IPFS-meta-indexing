import Master from "../model/masterSchema.js";
import { getFromIPFS, uploadToIPFS } from "../utils/ipfs.js";
import axios from "axios";

/**
 * Fetch all hackathons (lite version for listing)
 */
export const getHackathons = async (req, res) => {
  try {
    const master = await Master.findOne({ key: "hackathons" });
    if (!master) return res.status(404).json({ error: "No hackathons found" });

    const hackathons = await getFromIPFS(master.cid);
    if (!Array.isArray(hackathons)) return res.json([]);

    const liteHackathons = hackathons.map(h => ({
      _id: h._id,
      title: h.title,
      desc: h.desc,
      startDate: h.startDate,
      imageCID: h.imageCID,
      cid: h.cid || null,
    }));

    res.json(liteHackathons);
  } catch (err) {
    console.error("❌ Error fetching hackathons:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const createHackathon = async (req, res) => {
  try {
    const newHackathon = req.body;

    let master = await Master.findOne({ key: "hackathons" });
    let hackathons = master ? await getFromIPFS(master.cid) : [];
    if (!Array.isArray(hackathons)) hackathons = [];

    // Upload hackathon object
    const hackathonCID = await uploadToIPFS(newHackathon);

    const liteHackathon = {
      _id: newHackathon._id,
      title: newHackathon.title,
      desc: newHackathon.desc,
      startDate: newHackathon.startDate,
      imageCID: newHackathon.imageCID,
      cid: hackathonCID,
    };

    hackathons.push(liteHackathon);

    // Update master record
    const newMasterCID = await uploadToIPFS(hackathons);
    if (master) {
      master.cid = newMasterCID;
      await master.save();
    } else {
      master = await Master.create({ key: "hackathons", cid: newMasterCID });
    }

    res.json({
      message: "✅ Hackathon created",
      cid: hackathonCID,
      masterCid: newMasterCID,
    });
  } catch (err) {
    console.error("❌ Error creating hackathon:", err.message);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Fetch a hackathon by its CID
 */
export const getHackathonByCID = async (req, res) => {
  try {
    const { cid } = req.params;
    const response = await axios.get(`https://gateway.pinata.cloud/ipfs/${cid}`);

    res.status(200).json({ success: true, cid, data: response.data });
  } catch (err) {
    console.error("❌ Error fetching hackathon by CID:", err.message);
    res.status(500).json({ success: false, error: "Failed to fetch data from IPFS" });
  }
};


export const addVotes = async (req, res) => {
  try {
    const { cid } = req.params;       
    const { userCID } = req.body;     

    if (!userCID) {
      return res.status(400).json({ success: false, error: "userCID is required" });
    }

    // Fetch hackathon from IPFS
    const response = await axios.get(`https://gateway.pinata.cloud/ipfs/${cid}`);
    let hackathon = response.data;

    if (!hackathon.votesCount) hackathon.votesCount = 0;
    if (!Array.isArray(hackathon.votesCID)) hackathon.votesCID = [];

    if (hackathon.votesCID.includes(userCID)) {
      return res.status(400).json({ success: false, error: "User already voted" });
    }

    // Update votes
    hackathon.votesCount += 1;
    hackathon.votesCID.push(userCID);

    // Upload updated hackathon
    const newCID = await uploadToIPFS(hackathon);

    // OCC update master
    await updateMasterWithHackathon({
      oldCID: cid,
      newCID,
      _id: hackathon._id,
      title: hackathon.title,
      desc: hackathon.desc,
      startDate: hackathon.startDate,
      imageCID: hackathon.imageCID,
      votesCount: hackathon.votesCount,
      votesCID: hackathon.votesCID,
    });

    res.status(200).json({
      success: true,
      oldCID: cid,
      newCID,
      votesCount: hackathon.votesCount,
      votesCID: hackathon.votesCID,
    });
  } catch (err) {
    console.error("❌ Error adding vote:", err.message);
    res.status(500).json({ success: false, error: "Failed to add vote" });
  }
};

/**
 * OCC-style update of Master record with hackathon changes
 */export const updateMasterWithHackathon = async (body) => {
  try {
    const { _id, oldCID, newCID, title, desc, startDate, imageCID , votesCID, votesCount} = body;

    let master = await Master.findOne({ key: "hackathons" });
    if (!master) {
      throw new Error("No master record found for hackathons");
    }

    let hackathons = await getFromIPFS(master.cid);
    if (!Array.isArray(hackathons)) hackathons = [];

    const idx = hackathons.findIndex(h => h._id === _id);

    if (idx !== -1) {
      hackathons[idx] = {
        ...hackathons[idx],
        title: title || hackathons[idx].title,
        desc: desc || hackathons[idx].desc,
        startDate: startDate || hackathons[idx].startDate,
        imageCID: imageCID || hackathons[idx].imageCID,
        cid: newCID 
      };
    } else {
      hackathons.push({
        title: title || "",
        desc: desc || "",
        startDate: startDate || "",
        imageCID: imageCID || "",
        cid: newCID
      });
    }

    const newMasterCID = await uploadToIPFS(hackathons);

    master.cid = newMasterCID;
    await master.save();

    return newMasterCID;
  } catch (err) {
    console.error("Error updating master with hackathon:", err);
    throw err;
  }
};