import mongoose from "mongoose";

const masterSchema = new mongoose.Schema({
  entity: { 
    type: String, 
    enum: ["User", "Team", "Project", "Hackathon"], 
    required: true 
  },
  cid: { 
    type: String, 
    required: true, 
    unique: true 
  },
  lastSyncedAt: { 
    type: Date, 
    default: Date.now 
  }
});

export default mongoose.model("Master", masterSchema);
