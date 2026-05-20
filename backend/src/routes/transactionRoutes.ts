import express from "express";

import {
  createTransaction,
  getTransactions,
} from "../controllers/transactionController";

import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", protect, createTransaction);
router.get("/", protect, getTransactions);

export default router;