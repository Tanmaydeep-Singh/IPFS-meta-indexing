import express from "express";
import { createUser, getUserByCID } from "../controller/usersController.js";

const router = express.Router();

router.post("/", createUser );
router.get("/:cid", getUserByCID );

export default router;
