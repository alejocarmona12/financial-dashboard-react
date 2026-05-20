import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  id: string;
}

export interface AuthRequest extends Request {
  userId?: string;
}

export const protect = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        message: "No autorizado",
      });
    }

    const bearerToken = token.split(" ")[1];

    const decoded = jwt.verify(
      bearerToken,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    req.userId = decoded.id;

    next();
  } catch (error) {
    res.status(401).json({
      message: "Token inválido",
    });
  }
};