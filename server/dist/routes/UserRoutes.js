import express from 'express';
const UserAcccsessable = express.Router();
import { Fetch, ShowUrl } from '../Controller/process.js';
UserAcccsessable.get('/:URL', Fetch);
UserAcccsessable.get('/Url/show', ShowUrl);
export default UserAcccsessable;
