import express from 'express'
const UserAcccsessable=express.Router()
import { Fetch } from '../Controller/process.js'
UserAcccsessable.get('/:URL',Fetch)
export default  UserAcccsessable;