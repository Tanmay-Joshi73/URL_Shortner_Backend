import mongoose from "mongoose"
import {genSalt,hash,compare} from "bcryptjs"
import { promises } from "dns";
interface Iuser extends mongoose.Document{
  username:string,
  email:string,
  password:string,
  createdAt:Date,
  token:string
  exp:Date;
  comparePassword(candidatePassword : string):Promise<boolean>
}
  
const userSchema = new mongoose.Schema<Iuser>({
    username: {
     type: String,
     required:true
    },
    email: { type: String, unique: true },
    password: String, 
    token:{type:String,requried:true},
    exp:Date,
    createdAt: { type: Date, default: Date.now }
  });

 userSchema.pre<Iuser>('save',async function(next){
  if(!this.isModified('password')) return 
  const salt=await genSalt(10)
  this.password=await hash(this.password,salt)
  next()
 })
 userSchema.methods.comparePassword = async function (candidatePassword: string) {
  return await compare(candidatePassword, this.password);
};
export const userCollection = mongoose.model<Iuser>("userCollection", userSchema);
