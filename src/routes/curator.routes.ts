import { Router } from "express";
import { CuratorController } from "../controllers/CuratorController";

const router = Router();
const curatorController = new CuratorController();

router.post('/curator', curatorController.createUpdateCurator);
router.get('/');

export default router;