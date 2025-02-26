import crypto from "crypto";

export function generateRandomString(length: number): string {
    const BASE62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let str = "";
    const bytes = crypto.randomBytes(length);
    for (let i = 0; i < length; i++) {
        str += BASE62[bytes[i] % 62];
    }
    return str;
}