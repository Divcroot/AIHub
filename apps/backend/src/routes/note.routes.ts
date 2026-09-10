import { Router } from "express";
import {
    create,
    getAll,
    getById,
    update,
    remove
} from "../controllers/note.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.use(requireAuth);

router.post("/", create);
router.get("/", getAll);
router.get("/:id", getById);
router.patch("/:id", update);
router.delete("/:id", remove);

export default router;