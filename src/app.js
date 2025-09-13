import express from "express";
import dotenv from "dotenv";
import hackathonRoutes from "./routes/hackathonRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import userRoutes from "./routes/userRoutes.js"


dotenv.config();

const app = express();
app.use(express.json());

app.use("/hackathons", hackathonRoutes);
app.use("/projects", projectRoutes);
app.use("/user", userRoutes);

export default app;
