import express from "express";
import { Url_Shorten } from "../Controller/process.js";
const router = express.Router(); // ✅ Create a Router instance
router.post("/URL", Url_Shorten); // ✅ Register route correctly
export default router; // ✅ Export the router
