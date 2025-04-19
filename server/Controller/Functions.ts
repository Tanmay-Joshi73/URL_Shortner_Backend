import { customAlphabet } from "nanoid"
import jwt from "jsonwebtoken"
import mongoose, { ObjectId, Types } from "mongoose"
import { promises } from "dns"
import { NextFunction ,Request,Response} from "express"
import { decode } from "punycode"
import { createHash } from "crypto"
import { userCollection as userData } from "../Model/UserSchema.js"
export const Random=(URL:string)=>{
    
        const Random=  customAlphabet("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 6)
        const id=Random()
        return id;
}

export const generateShortCode = (URL: string): string => {
        // Create SHA-256 hash of the URL
        const hash = createHash('sha256').update(URL).digest('hex');
        
        // Base62 character set (same as your original)
        const base62 = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        
        // Convert first 8 hex characters (32 bits) to BigInt
        const num = BigInt('0x' + hash.substring(0, 8));
        
        // Convert to base62
        let result = '';
        let remaining = num;
        
        for (let i = 0; i < 6; i++) {
            result = base62[Number(remaining % 62n)] + result;
            remaining = remaining / 62n;
        }
        
        return result;
    };
    
    export const CreateToken = async (_id: Types.ObjectId, email: string): Promise<string> => {
        const idStr = _id.toString(); // 🔍 Convert ObjectId to string
        const currentUser=await userData.findById(_id)
        if(!currentUser) return "User Not Found"
        currentUser.token=idStr;
        currentUser.save()
        console.log("✅ Creating token for ID:", idStr);
      
        const token = jwt.sign(
          { id: idStr, email },
          process.env.JWT_SECRET!,
          { expiresIn: "15d" }
        );
      
        return token;
      }
interface user_info{
        user:string
}
// export const Verify=async(req:Request,res:Response,next:NextFunction):Promise<any>=>{
// const token=req.cookies.token_id;
// if(!token){
//   return res.send('Please Login Or Sign Up First')
// }
// const decoded=jwt.verify(token,process.env.JWT_SECRET as string)
// if(decoded){
//         next()
// }
// return res.send('please SignUp or Login')
// }