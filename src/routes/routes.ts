import { Router } from "express";
import { testGetData } from "../controllers/DataController";
import { AuthController } from "../controllers/AuthController";
import authRoutes from "./auth.routes";

const router = Router();

router.get("/data", testGetData);

router.use('/auth', authRoutes);


export default router;
