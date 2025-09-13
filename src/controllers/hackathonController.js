import { pinata } from "../config/pinata.js";
import Hackathon from "../models/Hackathon.js";
import axios from "axios";

export const createHackathon = async (req, res) => {
  try {
    const { title, description, bannerImageCID, docCID } = req.body;

    const response = await pinata.post("pinning/pinJSONToIPFS", {
      title,
      description,
    });

    const { IpfsHash } = response.data;

    const hackathon = new Hackathon({
      title,
      description,
      bannerImageCID,
      docCID,
      cid: IpfsHash,
    });

    await hackathon.save();

    res.status(201).json({
      message: "✅ Hackathon created successfully",
      hackathon,
    });
  } catch (err) {
    console.error("⚠️ Error creating hackathon:", err?.response?.data || err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const getHackathons = async (req, res) => {
  try {
    const hackathons = await Hackathon.find();
    res.json(hackathons);
  } catch (err) {
    console.error("⚠️ Error fetching hackathons:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getHackathonByCID = async (req, res) => {
  try {
    const cid = req.params.cid;
    const response = await axios.get(`https://gateway.pinata.cloud/ipfs/${cid}`);
    res.json({ cid, data: response.data });
  } catch (err) {
    console.error("⚠️ Error fetching hackathon JSON:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const updateHackathon = async (req, res) => {
  try {
    const { id } = req.params; 
    const { title, description, bannerImageCID, docCID } = req.body;

    const hackathon = await Hackathon.findById(id);
    if (!hackathon) {
      return res.status(404).json({ error: "Hackathon not found" });
    }


    if (hackathon.cid) {
      try {
        await pinata.delete(`/pinning/unpin/${hackathon.cid}`);
      } catch (err) {
        console.warn("⚠️ Failed to unpin old CID:", err?.response?.data || err.message);
      }
    }

    const response = await pinata.post("pinning/pinJSONToIPFS", {
      title,
      description,
    });

    const { IpfsHash } = response.data;

    hackathon.title = title || hackathon.title;
    hackathon.description = description || hackathon.description;
    hackathon.bannerImageCID = bannerImageCID || hackathon.bannerImageCID;
    hackathon.docCID = docCID || hackathon.docCID;
    hackathon.cid = IpfsHash;
    hackathon.uploadedAt = new Date();

    await hackathon.save();

    res.json({
      message: "✅ Hackathon updated successfully",
      hackathon,
    });
  } catch (err) {
    console.error("⚠️ Error updating hackathon:", err?.response?.data || err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const deleteHackathon = async (req, res) => {
  try {
    const { id } = req.params;

    const hackathon = await Hackathon.findById(id);
    if (!hackathon) {
      return res.status(404).json({ error: "Hackathon not found" });
    }

    if (hackathon.cid) {
      try {
        await pinata.delete(`/pinning/unpin/${hackathon.cid}`);
        console.log(`🗑️ Unpinned CID ${hackathon.cid} from Pinata`);
      } catch (err) {
        console.warn("⚠️ Failed to unpin from Pinata:", err?.response?.data || err.message);
      }
    }

await Hackathon.findByIdAndDelete(id);

    res.json({ message: "✅ Hackathon deleted successfully" });
  } catch (err) {
    console.error("⚠️ Error deleting hackathon:", err?.response?.data || err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
