import { Router } from "express";
import { CuratorController } from "../controllers/CuratorController";

const router = Router();
const curatorController = new CuratorController();

router.post("/curator", curatorController.createUpdateCurator);
router.get("/id/:id", curatorController.getCuratorById);
router.get("/username/:userName", curatorController.getCuratorByUserName);
router.post("/playlist", curatorController.saveCuratorPlaylist);
router.get("/playlist/:id", curatorController.getCuratorPlaylists);

export default router;
