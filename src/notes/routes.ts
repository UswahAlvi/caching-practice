import express from "express";
import {
    getNotes,
    getNoteById,
    addNote,
    updateNote,
    deleteNote,
} from "./controller";
import {nodeCacheMiddleware} from "../middlewares/nodeCacheMiddleware";
import {redisCacheMiddleware} from "../middlewares/redisCacheMiddleware";

const router = express.Router();

router.get("/notes", getNotes);
router.get("/notes/:id",[nodeCacheMiddleware, redisCacheMiddleware],  getNoteById);
router.post("/notes", addNote);
router.put("/notes/:id", updateNote);
router.delete("/notes/:id", deleteNote);

export default router;
