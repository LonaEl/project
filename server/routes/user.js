import express from "express";
const router = express.Router();

import { signin, signup, updatepassword } from "../controllers/user.js";

router.post("/signin", signin);
router.post("/signup", signup);
router.patch("/updatepassword", updatepassword)

export default router;