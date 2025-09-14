
import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users"
    }
  ],
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Projects"
  }
}, { timestamps: true });

export default mongoose.model("Teams", teamSchema);
