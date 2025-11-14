import express from "express";
import { GetByFilter, GetIndex } from "../controllers/HomeController.js";

const router = express.Router();

router.get("/", GetIndex);
router.get("/filter", GetByFilter);

export default router;
