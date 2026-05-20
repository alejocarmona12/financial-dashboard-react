import {
  Request,
  Response,
  NextFunction,
} from "express";

const errorMiddleware = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.log(err);

  res.status(500).json({
    message: "Error servidor",
    error: err.message,
  });
};

export default errorMiddleware;