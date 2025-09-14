import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  github: { type: String },
  cid: { type: String, required: true },
  votes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      default: []
    }
  ],
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teams",
    unique: true,
    required: true
  },
  hackathon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hackathons",
    required: true
  }
}, { timestamps: true });

export default mongoose.model("Projects", projectSchema);
