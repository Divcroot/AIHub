import { Router } from "express";
import { upload, getAll, remove } from "../controllers/document.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { uploadDocument } from "../middleware/upload.middleware.js";

const router = Router();

router.use(requireAuth);

router.post("/upload", uploadDocument.single("file"), upload);
router.get("/", getAll);
router.delete("/:id", remove);

export default router;