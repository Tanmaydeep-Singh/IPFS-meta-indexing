import express from "express";
import dotenv from 'dotenv';
dotenv.config({ quiet: true });
import hackathonRoutes from "./routes/hackathonRoutes.js";
import projectsRoutes from "./routes/projectsRoutes.js";
import teamsRoutes from "./routes/teamRoutes.js"
import userRoutes from "./routes/userRoutes.js"

dotenv.config();

const app = express();
app.use(express.json());

app.use("/hackathons", hackathonRoutes);
app.use("/projects", projectsRoutes);
app.use("/teams", teamsRoutes);
app.use("/users", userRoutes);




export default app;
