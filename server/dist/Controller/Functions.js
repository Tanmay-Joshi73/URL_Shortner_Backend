import { customAlphabet } from "nanoid";
import jwt from "jsonwebtoken";
export const Random = (URL) => {
    const Random = customAlphabet("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 6);
    const id = Random();
    return id;
};
export const CreateToken = async (_id, email) => {
    const token = jwt.sign({ id: _id.toString(), email: email }, process.env.JWT_SECRET, { expiresIn: "15d" });
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
