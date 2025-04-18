import { customAlphabet } from "nanoid";
import jwt from "jsonwebtoken";
import { createHash } from "crypto";
export const Random = (URL) => {
    const Random = customAlphabet("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 6);
    const id = Random();
    return id;
};
export const generateShortCode = (URL) => {
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
export const CreateToken = async (_id, email) => {
    const token = jwt.sign({ id: _id.toString(), email: email }, process.env.JWT_SECRET, { expiresIn: "15d" });
    console.log('token', _id.toString());
    return token;
};
export const Verify = async (req, res, next) => {
    const token = req.cookies.token_id;
    if (!token) {
        return res.send('Please Login Or Sign Up First');
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded) {
        next();
    }
    return res.send('please SignUp or Login');
};
