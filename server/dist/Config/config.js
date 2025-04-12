import mongoose from "mongoose";
import { createClient } from 'redis';
import logger from "../Logger/Logger.js";
const URL = process.env.MONGO;
const Connect = async () => {
    try {
        // console.log(process.env.MONGO),{}
        await mongoose.connect(process.env.MONGO, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    }
    catch (err) {
        logger.error(err);
        return;
    }
};
const redisClient = createClient({
    socket: {
        host: '127.0.0.1', // or 'localhost'
        port: 6379
    }
});
redisClient.on('error', err => console.log('Redis Client Error', err));
await redisClient.connect();
await redisClient.set('foo', 'bar');
const result = await redisClient.get('foo');
console.log(result); // >>> bar
export { Connect, redisClient };
// export {Connect}
