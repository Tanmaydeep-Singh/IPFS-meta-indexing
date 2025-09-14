import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    github: { type: String },
team: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Teams",
  unique: true
},
hackathon: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Hackathon",
  required: true
}
,
    cid: { type: String, unique: true },
    votes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
            default:[]
        }

    ]
});

export default mongoose.model("Project", projectSchema);
