import express from "express";
import { Url_Shorten, CreateUser, Login, Check } from "../Controller/process.js";
const router = express.Router(); // ✅ Create a Router instance
router.post("/URL", Url_Shorten); // ✅ Register route correctly
router.post('/Sign', CreateUser);
router.post('/Login', Login);
router.get('/CookieCheck', Check);
export default router; // ✅ Export the router
