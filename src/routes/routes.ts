import { Router } from "express";
import { testGetData } from "../controllers/dataController";

const router = Router();

router.get("/data", testGetData);

export default router;
