import express from "express";
import { Url_Shorten ,CreateUser,Login} from "../Controller/process.js";
const router = express.Router(); // ✅ Create a Router instance

router.post("/URL", Url_Shorten); // ✅ Register route correctly
router.post('/Sign',CreateUser)
router.post('/Login',Login)
export default router; // ✅ Export the router
