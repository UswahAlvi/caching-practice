import express from "express";
import {
    getNotes,
    getNoteById,
    addNote,
    updateNote,
    deleteNote,
} from "./controller";
import {cacheMiddleware} from "../middlewares/cache-middleware";

const router = express.Router();

router.use("/notes/:id", cacheMiddleware)

router.get("/notes", getNotes);
router.get("/notes/:id", getNoteById);
router.post("/notes", addNote);
router.put("/notes/:id", updateNote);
router.delete("/notes/:id", deleteNote);

export default router;
