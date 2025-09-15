import mongoose from "mongoose";

const masterSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true }, // e.g. "hackathons"
  cid: { type: String, required: true },               // latest CID
});

export default mongoose.model("Master", masterSchema);
