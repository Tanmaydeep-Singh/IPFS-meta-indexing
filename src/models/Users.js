import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["participant", "admin"],
        default: "participant",
    },
    // team: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Teams",
    // },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("Users", userSchema);
