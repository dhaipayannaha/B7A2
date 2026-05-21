import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config/index.js";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try { 
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, message: "Authorization header missing" });
    }

    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;
    
    if (!token) {
      return res.status(401).json({ success: false, message: "Token missing" });
    }

    const decoded = jwt.verify(token, config.database.secret as string);
    (req as any).user = decoded;
    
    next();
  } catch (error: any) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
      error: error.message
    });
  }
};
