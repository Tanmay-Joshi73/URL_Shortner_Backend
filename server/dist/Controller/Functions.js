import { customAlphabet } from "nanoid";
export const Random = (URL) => {
    const Random = customAlphabet("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 6);
    const id = Random();
    return id;
};
