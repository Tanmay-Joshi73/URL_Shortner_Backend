import mongoose from "mongoose";
import { genSalt, hash, compare } from "bcryptjs";
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: { type: String, unique: true },
    password: String, // hashed
    createdAt: { type: Date, default: Date.now }
});
userSchema.pre('save', async function (next) {
    if (!this.isModified('password'))
        return;
    const salt = await genSalt(10);
    this.password = await hash(this.password, salt);
    next();
});
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await compare(candidatePassword, this.password);
};
export const userCollection = mongoose.model("userCollection", userSchema);
