import { customAlphabet } from "nanoid"
import jwt from "jsonwebtoken"
import mongoose, { ObjectId, Types } from "mongoose"
import { promises } from "dns"
import { NextFunction ,Request,Response} from "express"
import { decode } from "punycode"
export const Random=(URL:string)=>{
    
        const Random=  customAlphabet("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 6)
        const id=Random()
        return id;
}
export const CreateToken=async(_id:Types.ObjectId,email:string):Promise<string>=>{

        const token = jwt.sign(
                { id: _id.toString(), email:email },
                process.env.JWT_SECRET!,
                { expiresIn: "15d" }
              );       
        
        return token
        
}
interface user_info{
        user:string
}
export const Verify=async(req:Request,res:Response,next:NextFunction):Promise<any>=>{
const token=req.cookies.token_id;
if(!token){
  return res.send('Please Login Or Sign Up First')
}
const decoded=jwt.verify(token,process.env.JWT_SECRET as string)
if(decoded){
        next()
}
return res.send('please SignUp or Login')
}