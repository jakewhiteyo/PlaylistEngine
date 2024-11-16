import { Router } from "express";
import { testGetData } from "../controllers/DataController";

const router = Router();

router.get("/data", testGetData);

export default router;
