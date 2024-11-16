import { Router } from "express";
import { testGetData } from "../controllers/DataController";

const router = Router();

/**
 * @swagger
 * /api/data:
 *   get:
 *     summary: Get test data
 *     description: Retrieves test data from the system
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */router.get("/data", testGetData);

export default router;
