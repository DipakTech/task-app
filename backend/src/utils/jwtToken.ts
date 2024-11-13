import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import { Response } from "express";

const accessToken = process.env.ACCESS_TOKEN_SECRET;
if (!accessToken) {
	  throw new Error("ACCESS_Token_SECRET is not defined in the environment variables");
}

export const createAccessToken = (payload: User, res: Response) => {
	  const token = jwt.sign(payload, accessToken, { expiresIn: "30d" });

	    res.cookie("authToken", token, {
		        httpOnly: true,
			    secure: process.env.NODE_ENV === "production",
			      });

			        return token;
};

