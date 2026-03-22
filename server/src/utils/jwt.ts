import jwt from "jsonwebtoken";

type JwtPayload = {
    _id: string;
    email: string;
    role: string;
};

export const signJwt = (payload: JwtPayload): string => {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }

    return jwt.sign(payload, secret, {
        expiresIn: "7d"
    });
};

export const verifyJwt = (token: string): JwtPayload => {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }

    return jwt.verify(token, secret) as JwtPayload;
};