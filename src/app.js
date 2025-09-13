import express from "express";
import dotenv from "dotenv";
import hackathonRoutes from "./routes/hackathonRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/hackathons", hackathonRoutes);

export default app;
