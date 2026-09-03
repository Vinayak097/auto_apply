import type { Request, Response, NextFunction } from "express";
import responseSend from "./statusCodes";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET!;
export async function validToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    responseSend(401, res);
    return;
  }
  const token = authHeader.split(" ")[1];
  if (token==null) {
    return res.status(401).json({
      success: false,
      message: "Invalid authorization header",
    });
  }
  const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

  req.userId = decoded.id;
  next();
}
