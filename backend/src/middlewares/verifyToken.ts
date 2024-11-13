import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import { prisma } from "../db";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

interface JWTPayload {
  id: string;
  iat?: number;
  exp?: number;
}

const { ACCESS_TOKEN_SECRET } = process.env;

if (!ACCESS_TOKEN_SECRET) {
  throw new Error(
    "ACCESS_TOKEN_SECRET is not defined in environment variables",
  );
}

export const verifyAccessToken: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const token = req.cookies["authToken"];

    if (!token) {
      res.status(401).json({
        status: false,
        msg: "Access token not found in cookies",
      });
      return;
    }

    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as JWTPayload;

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
    });

    if (!user) {
      res.status(401).json({
        status: false,
        msg: "User not found",
      });
      return;
    }
    const { password, ...userWithoutPassword } = user;
    req.user = userWithoutPassword as User;

    next();
  } catch (error) {
    console.log(req.cookies);
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        status: false,
        msg: "Invalid or expired token",
      });
      return;
    }
    res.status(500).json({
      status: false,
      msg: "Internal server error",
    });
    return;
  }
};
