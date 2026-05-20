import express from "express";
import { protect } from "../middleware/authMiddleware";
import { body } from "express-validator";

import {
  
  register,
  login,
} from "../controllers/authController";

const router = express.Router();

router.post(
  "/register",

  [
    body("name")
      .notEmpty()
      .withMessage("Nombre requerido"),

    body("email")
      .isEmail()
      .withMessage("Email inválido"),

    body("password")
      .isLength({ min: 6 })
      .withMessage(
        "Password mínimo 6 caracteres"
      ),
  ],

  register
);
router.post(
  "/login",

  [
    body("email")
      .isEmail()
      .withMessage("Email inválido"),

    body("password")
      .notEmpty()
      .withMessage("Password requerido"),
  ],

  login
);
router.get("/profile", protect, (req, res) => {
  res.json({
    message: "Perfil protegido",
  });
});

export default router;

  