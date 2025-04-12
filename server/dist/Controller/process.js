import { redisClient } from "../Config/config.js";
import logger from "../Logger/Logger.js";
import { Urls } from "../Model/Process.js";
import { Random } from "../Controller/Functions.js";
import { userCollection as userData } from "../Model/UserSchema.js";
import { CreateToken } from "../Controller/Functions.js";
export const Url_Shorten = async (req, res) => {
    const { URL } = req.body;
    const Origin = process.env.OriginalUrlServer;
    if (!URL) {
        logger.error("❌ Hey, URL is not given to the system");
        return res.status(400).json({ error: "URL is required" });
    }
    try {
        // Check in Redis Cache
        const CacheExist = await redisClient.get(URL);
        if (CacheExist) {
            return res.json({ message: `Your Cached URL is: ${Origin}/${CacheExist}` });
        }
        // Check in Database
        const DBExist = await Urls.findOne({ LongURl: URL });
        if (DBExist) {
            const shortUrl = DBExist.ShortUrl;
            await redisClient.set(URL, shortUrl);
            return res.json({ message: `Your shortened URL is: ${Origin}/${shortUrl}` });
        }
        // Generate Short URL
        const shortCode = Random(URL);
        await redisClient.set(URL, shortCode);
        // Save to Database
        const newData = await Urls.create({
            LongUrl: URL,
            ShortUrl: shortCode,
        });
        const origin = process.env.OriginalUrlServer;
        return res.json({ message: `Your shortened URL is: ${origin}/${shortCode}` });
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
        return res.send("Hey URl is not provided,Please Provide the given Url");
    }
    const Existing = await Urls.findOne({
        ShortUrl: URL
    });
    if (!Existing) {
        return res.send("Url Is Not Existed ");
    }
    Existing.Clicks = Existing.Clicks + 1;
    const FullURl = Existing.LongUrl;
    const CacheExist = await redisClient.get(FullURl);
    if (!CacheExist) {
        await redisClient.set(FullURl, URL);
    }
    Existing.save();
    return res.redirect(FullURl);
};
export const ShowUrl = async (req, res) => {
    const data = await Urls.find().select('-id');
    res.send(data);
};
export const CreateUser = async (req, res) => {
    const { username, password, email } = req.body;
    if (!username || !password || !email) {
        return res.send('please provide the Everydata');
    }
    const userExist = await userData.findOne({ email: email });
    if (userExist) {
        return res.send("please Email already exist ,Please Login Instead");
    }
    const newUser = await userData.create({
        username: username,
        email: email,
        password: password
    });
    const token = CreateToken(newUser._id, newUser.email);
    res.cookie('token_id', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict", // CSRF protection
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    });
};
export const Login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.send('please provide the Everydata');
    const userExist = await userData.findOne({ email: email });
    if (!userExist) {
        return res.send("Invalid Email Or Password");
    }
    // @ts-ignore
    const isMatchPassword = await userExist.comparePassword(password);
    if (!isMatchPassword)
        return res.send("Invalid Email Or Password");
    const token = CreateToken(userExist._id, userExist.email);
    res.cookie('token_id', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict", // CSRF protection
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    });
};
