import mongoose from "mongoose";

const hackathonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  cid: { type: String, unique: true },
  imageCid: String, 
  docCid: String,   
  startDate: Date,
  endDate: Date,
  uploadedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Hackathon", hackathonSchema);
