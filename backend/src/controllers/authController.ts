import { Request, Response } from "express";
import bcrypt from "bcryptjs";

import generateToken from "../utils/generateToken";
import { validationResult } from "express-validator";

import User from "../Models/User";

// REGISTER
export const register = async ( 
  req: Request,
  res: Response
) => {
  const errors = validationResult(req);

if (!errors.isEmpty()) {
  return res.status(400).json({
    errors: errors.array(),
  });
}
  try {
    const { name, email, password } =
      req.body;

    const userExists =
      await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "Usuario ya existe",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(
        user._id.toString()
      ),
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Error servidor",
    });
  }
};

// LOGIN
export const login = async (
  req: Request,
  res: Response
) => {
  try {
    const { email, password } =
      req.body;

    const user =
      await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Usuario no existe",
      });
    }

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res.status(400).json({
        message: "Password incorrecta",
      });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(
        user._id.toString()
      ),
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Error servidor",
    });
  }
};