import { Router } from "express";
import { SubmissionController } from "../controllers/SubmissionController";

const router = Router();
const submissionController = new SubmissionController();

router.post("/submit", submissionController.submitSongToCurator);
router.get("/:curatorId", submissionController.getCuratorSubmissions);

export default router;
