import express from "express";
import { getAllEntities } from "../controllers/masterController.js";

const router = express.Router();


router.get("/:entity", getAllEntities);


export default router;
 