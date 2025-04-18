import { redisClient } from "../Config/config.js";
import logger from "../Logger/Logger.js";
import jwt from "jsonwebtoken";
import { Urls } from "../Model/Process.js";
import { Types } from "mongoose";
import { userCollection as userData } from "../Model/UserSchema.js";
import { CreateToken, generateShortCode } from "../Controller/Functions.js";
export const Url_Shorten = async (req, res) => {
    const { URL } = req.body;
    const Origin = process.env.OriginalUrlServer;
    if (!URL) {
        logger.error("❌ Hey, URL is not given to the system");
        return res.status(400).json({ error: "URL is required" });
    }
    try {
        // Check in Redis Cache first
        const cachedShortCode = await redisClient.get(URL);
        if (cachedShortCode) {
            return res.json({ message: `Your Cached URL is: ${Origin}/${cachedShortCode}` });
        }
        const existingUrl = await Urls.findOne({ LongUrl: URL });
        if (existingUrl) {
            await redisClient.set(URL, existingUrl.ShortUrl);
            return res.json({ message: `Your shortened URL is: ${Origin}/${existingUrl.ShortUrl}` });
        }
        let shortCode = generateShortCode(URL);
        let attempts = 0;
        const MAX_ATTEMPTS = 3;
        while (await Urls.findOne({ ShortUrl: shortCode })) {
            if (attempts++ >= MAX_ATTEMPTS) {
                const randomSuffix = Math.floor(Math.random() * 1000).toString(36).slice(0, 2);
                shortCode = shortCode.slice(0, 4) + randomSuffix;
                break;
            }
            shortCode = generateShortCode(URL + attempts.toString());
        }
        await redisClient.set(URL, shortCode);
        // Save to database
        await Urls.create({
            LongUrl: URL,
            ShortUrl: shortCode,
            Clicks: 0
        });
        return res.json({
            message: `Your shortened URL is: ${Origin}/${shortCode}`,
            shortUrl: `${Origin}/${shortCode}`
        });
    }
    catch (error) {
        logger.error("❌ Error shortening URL:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
export const Fetch = async (req, res) => {
    const { URL } = req.params;
    const Origin = process.env.OriginalUrlServer;
    if (!URL) {
        return res.status(400).send("Hey URL is not provided, Please Provide the given Url");
    }
    try {
        const existingUrl = await Urls.findOne({ ShortUrl: URL });
        if (!existingUrl) {
            return res.status(404).send("URL Does Not Exist");
        }
        // Update click count
        existingUrl.Clicks += 1;
        await existingUrl.save();
        // Update cache
        await redisClient.set(existingUrl.LongUrl, URL);
        return res.redirect(existingUrl.LongUrl);
    }
    catch (error) {
        logger.error("❌ Error fetching URL:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
export const ShowUrl = async (req, res) => {
    try {
        const data = await Urls.find().select('-__v');
        res.json(data);
    }
    catch (error) {
        logger.error("❌ Error fetching URLs:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
// User management functions remain the same
export const CreateUser = async (req, res) => {
    const { username, password, email } = req.body;
    logger.info("user is craeted");
    if (!username || !password || !email) {
        return res.status(400).send('Please provide all required data');
    }
    try {
        const userExist = await userData.findOne({ email });
        if (userExist) {
            return res.status(409).send("Email already exists, please login instead");
        }
        const newUser = await userData.create({ username, email, password });
        logger.info(newUser);
        console.log('userid at the time of creation', newUser);
        const token = await CreateToken(newUser._id, newUser.email);
        res.cookie('token_id', token, {
            httpOnly: true,
            secure: false,
            sameSite: "none",
            maxAge: 24 * 60 * 60 * 1000
        });
        logger.info("before sending the data to the client");
        return res.status(201).json({ data: true });
    }
    catch (error) {
        logger.error("❌ Error creating user:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
export const Login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send('Please provide both email and password');
    }
    try {
        const userExist = await userData.findOne({ email });
        if (!userExist) {
            return res.status(401).send("Invalid email or password");
        }
        // @ts-ignore
        const isMatchPassword = await userExist.comparePassword(password);
        if (!isMatchPassword) {
            return res.status(401).send("Invalid email or password");
        }
        const token = CreateToken(userExist._id, userExist.email);
        res.cookie('token_id', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000
        });
        return res.json({ message: "Logged in successfully" });
    }
    catch (error) {
        logger.error("❌ Error during login:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
export const Check = async (req, res, next) => {
    const token = req.cookies?.token_id;
    console.log("🔍 Cookies received:", req.cookies);
    if (!token) {
        console.log("❌ No token found in cookies");
        return res.status(401).json({ authenticated: false });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("✅ Token decoded:", decoded);
        const currentTimeInSec = Math.floor(Date.now() / 1000);
        if (decoded.exp < currentTimeInSec) {
            console.log("❌ Token expired");
            return res.status(401).json({ authenticated: false });
        }
        const userId = new Types.ObjectId(decoded.id);
        console.log("🔐 Converted ObjectId:", userId);
        const user = await userData.findById(userId);
        if (!user) {
            console.log("❌ User not found in DB");
            return res.status(404).json({ authenticated: false, message: "User not found" });
        }
        console.log("✅ User found:", user.username);
        // You can attach the user to the request object here if needed
        // (req as any).user = user;
        return res.status(200).json({ authenticated: true, user });
    }
    catch (error) {
        console.error("❌ Token verification failed:", error);
        return res.status(401).json({ authenticated: false });
    }
};
