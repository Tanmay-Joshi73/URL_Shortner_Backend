import express from 'express';
import dotnev from 'dotenv';
import { Connect } from './Config/config.js';
dotnev.config();
import router from './routes/process.js';
import bodyParser from 'body-parser';
import logger from './Logger/Logger.js';
import UserAcccsessable from './routes/UserRoutes.js';
const app = express();
app.use(bodyParser.json());
app.use('/api', router);
app.use('/', UserAcccsessable);
const Start = async () => {
    try {
        await Connect();
        app.listen(8000, '127.0.0.1', () => {
            console.log('server is listening to the 127.0.0.1');
        });
    }
    catch (err) {
        logger.error(err);
    }
};
Start();
