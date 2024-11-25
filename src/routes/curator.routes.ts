import { Router } from "express";
import { CuratorController } from "../controllers/CuratorController";

const router = Router();
const curatorController = new CuratorController();

router.post("/curator", curatorController.createUpdateCurator);
router.get("/:id", curatorController.getCurator);
router.post("/playlist", curatorController.saveCuratorPlaylist);
router.get("/playlist/:id", curatorController.getCuratorPlaylists);

export default router;
