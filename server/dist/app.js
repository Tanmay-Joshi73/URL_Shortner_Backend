import express from 'express';
import dotnev from 'dotenv';
import { Connect } from './Config/config.js';
dotnev.config();
import router from './routes/process.js';
import bodyParser from 'body-parser';
import logger from './Logger/Logger.js';
import UserAcccsessable from './routes/UserRoutes.js';
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(morgan('dev')); // or 'combined', 'tiny', etc.
app.use('/api', router);
app.use('/', UserAcccsessable);
const Start = async () => {
    try {
        console.log(process.env.Redis_Password);
        console.log(process.env.Redis_Connection);
        await Connect();
        app.listen(8000, '0.0.0.0', () => {
            console.log('server is listening to the 127.0.0.1');
        });
    }
    catch (err) {
        logger.error(err);
    }
};
Start();
