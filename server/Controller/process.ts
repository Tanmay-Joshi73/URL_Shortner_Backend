import { Request, Response } from "express";
import { redisClient } from "../Config/config.js";
import logger from "../Logger/Logger.js";
import { Urls } from "../Model/Process.js";
import { Random } from "../Controller/Functions.js";

export const Url_Shorten = async (req: Request, res: Response) :Promise<any>=> {
    const { URL } = req.body;
    const Origin=process.env.OriginalUrlServer
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
        const origin =process.env.OriginalUrlServer
        return res.json({ message: `Your shortened URL is: ${origin}/${shortCode}` });

    } catch (error) {
        logger.error("❌ Error shortening URL:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const Fetch=async(req:Request,res:Response):Promise<any>=>{
    const {URL}=req.params;
    const Origin=process.env.OriginalUrlServer;
   if(!URL){
    return res.send("Hey URl is not provided,Please Provide the given Url")
   }
   const Existing=await Urls.findOne({
    ShortUrl:URL
   })
   if(!Existing){
    return res.send("Url Is Not Existed ")
   }
   const FullURl=Existing.LongUrl;
   const CacheExist=await redisClient.get(FullURl)
   if(!CacheExist){
    await redisClient.set(FullURl,URL)
   }
   return res.redirect(FullURl)
}
