import express from "express";
import {
  Delete,
  GetAdd,
  GetIndex,
  GetUpdate,
  PostAdd,
  PostUpdate,
} from "../controllers/RegionController.js";

const router = express.Router();

router.get("/index", GetIndex);
router.get("/add", GetAdd);
router.post("/add", PostAdd);
router.get("/update/:regionID", GetUpdate);
router.post("/update", PostUpdate);
router.post("/delete", Delete);

export default router;
