import { Router } from "express";
import { testGetData } from "../controllers/DataController";
import authRoutes from "./auth.routes";
import curatorRoutes from "./curator.routes";
import submissionRoutes from "./submission.routes";

const router = Router();

router.get("/data", testGetData);
router.use("/auth", authRoutes);
router.use("/curators", curatorRoutes);
router.use("/submissions", submissionRoutes);

export default router;
