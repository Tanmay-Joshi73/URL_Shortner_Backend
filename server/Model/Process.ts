import { time } from "console";
import mongoose from "mongoose";
const Schema=new mongoose.Schema({
 LongUrl:{
    type:String,
    unique:true,
    required:true
 },
 ShortUrl:{
    type:String,
    unique:true,
    required:true
 },
 user: { type: mongoose.Schema.Types.ObjectId, ref: 'userCollection' },
 Clicks:{
    type:Number,
    default:0
 },
 typeStamp:{
    type:Date,
    default:Date.now(),
    required:true
 }
});

export const Urls=mongoose.model("Urls",Schema)