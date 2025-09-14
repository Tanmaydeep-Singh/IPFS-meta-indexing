import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users", 
      },
    ],
    hackathon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hackathon",
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users", 
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Teams", teamSchema);
