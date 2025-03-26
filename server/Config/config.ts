import mongoose from "mongoose";
import {Redis} from "ioredis";
import logger from "../Logger/Logger.js";
import { error } from "console";
const URL =process.env.MONGO;
const Connect=async()=>{
    try{
    // console.log(process.env.MONGO),{}
    await mongoose.connect(process.env.MONGO as string, {
      useNewUrlParser: true,
      useUnifiedTopology: true
  } as any)
}

catch(err){
    logger.error(err)
    return;
    }
}

const redisClient = new Redis({
    host: "127.0.0.1",  // Change to your Redis server if needed
    port: 6379,         // Default Redis port
  });
  
  redisClient.on("connect", () => {
    console.log("✅ Connected to Redis");
  });
  
  redisClient.on("error", (err) => {
    console.error("❌ Redis Error:", err);
  });
  
export {Connect ,redisClient}