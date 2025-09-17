import Master from "../model/masterSchema.js";
import { getFromIPFS, uploadToIPFS } from "../utils/ipfs.js";
import axios from "axios";

export const getHackathons = async (req, res) => {
  try {
    const master = await Master.findOne({ key: "hackathons" });
    if (!master) return res.status(404).json({ error: "No hackathons found" });

    const hackathons = await getFromIPFS(master.cid);

    const liteHackathons = hackathons.map(h => ({
      title: h.title,
      desc: h.desc,
      startDate: h.startDate,
      imageCID: h.imageCID,
      cid: h.cid || null  
    }));

    res.json(liteHackathons);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const createHackathon = async (req, res) => {
  try {
    const newHackathon = req.body;

    let master = await Master.findOne({ key: "hackathons" });
    let hackathons = [];

    if (master) {
      hackathons = await getFromIPFS(master.cid);
    }

    const hackathonCID = await uploadToIPFS(newHackathon);

    const liteHackathon = {
      title: newHackathon.title,
      desc: newHackathon.desc,
      startDate: newHackathon.startDate,
      imageCID: newHackathon.imageCID,
      cid: hackathonCID
    };

    hackathons.push(liteHackathon);

    const newMasterCID = await uploadToIPFS(hackathons);

    if (master) {
      master.cid = newMasterCID;
      await master.save();
    } else {
      master = await Master.create({ key: "hackathons", cid: newMasterCID });
    }

    res.json({ message: "✅ Hackathon created", cid: hackathonCID, masterCid: newMasterCID });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getHackathonByCID = async (req, res) => {
  try {
    const { cid } = req.params;
    const response = await axios.get(`https://gateway.pinata.cloud/ipfs/${cid}`);

    res.status(200).json({
      success: true,
      cid,
      data: response.data,
    });
  } catch (err) {
    console.error("❌ Error fetching hackathon by CID:", err.message);
    res.status(500).json({ success: false, error: "Failed to fetch data from IPFS" });
  }
};

export const addVotes = async (req, res) => {
  try {
    const { cid } = req.params; // hackathon/project CID
    const { userCID } = req.body; // voter user CID

    if (!userCID) {
      return res.status(400).json({ success: false, error: "userCID is required" });
    }

    // Fetch current data from IPFS
    const response = await axios.get(`https://gateway.pinata.cloud/ipfs/${cid}`);
    let hackathon = response.data;

    // Ensure vote structure exists
    if (!hackathon.votesCount) hackathon.votesCount = 0;
    if (!Array.isArray(hackathon.votesCID)) hackathon.votesCID = [];

    // Check if user already voted
    if (hackathon.votesCID.includes(userCID)) {
      return res.status(400).json({ success: false, error: "User already voted" });
    }

    // Update votes
    hackathon.votesCount += 1;
    hackathon.votesCID.push(userCID);

    // Upload updated object back to IPFS
    const newCID = await uploadToIPFS(hackathon);

  const masterBody = {
            oldCID: cid,
            newCID: newCID,
            title: hackathon.title,
            desc: hackathon.desc,
            startDate: hackathon.startDate,
            imageCID: hackathon.imageCID,
            votesCount: hackathon.votesCount,
            votesCID: hackathon.votesCID
        };

        await updateMasterWithHackathon(masterBody);

    res.status(200).json({
      success: true,
      oldCID: cid,
      newCID,
      votesCount: hackathon.votesCount,
      votesCID: hackathon.votesCID
    });
  } catch (err) {
    console.error("❌ Error adding vote:", err.message);
    res.status(500).json({ success: false, error: "Failed to add vote" });
  }
};


export const updateMasterWithHackathon = async (body) => {
  try {
    const { oldCID, newCID, title, desc, startDate, imageCID , votesCID, votesCount} = body;

    console.log(oldCID, newCID);

    let master = await Master.findOne({ key: "hackathons" });
    if (!master) {
      throw new Error("No master record found for hackathons");
    }

    let hackathons = await getFromIPFS(master.cid);
    if (!Array.isArray(hackathons)) hackathons = [];

    const idx = hackathons.findIndex(h => h.cid === oldCID);

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


