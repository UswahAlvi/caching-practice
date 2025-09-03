import { pool } from "../../db";
import { Request, Response } from "express";
import {Cache} from '../services/nodeCacheService'
import {RedisService} from "../services/redisService";
export const getNotes = async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM notes');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch notes" });
    }
};

export const getNoteById = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
        return res.status(400).json({ error: "Invalid or missing note ID" });
    }

    try {
        let note = Cache.get(id);
        if (note) {
            return res.status(200).json(note);
        }

        const cachedNote = await RedisService.get(id);
        if (cachedNote) {
            return res.status(200).json(cachedNote);
        }

        const result = await pool.query('SELECT * FROM notes WHERE id = $1', [id]);
        note = result.rows[0];

        if (!note) {
            return res.status(404).json({ error: "Note not found" });
        }

        Cache.set(id, note);
        await RedisService.set(id, JSON.stringify(note));

        return res.status(200).json(note);
    } catch (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Failed to fetch note" });
    }
};


export const addNote =async (req: Request, res: Response) => {
    const { title, description } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO notes (title, description) VALUES ($1, $2) RETURNING *',
            [title, description]);
        res.status(200).json(result);
    }catch(err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to add note" });
    }
};

export const updateNote = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, description } = req.body;
    try {
        const result = await pool.query(
            'UPDATE notes SET title = $1, description = $2 WHERE id = $3 RETURNING *',
            [title, description, id]);
        if (result.rows.length === 0) {
            return res.status(404).json({error: "Note not found"});
        }
        const note=result.rows[0];
        Cache.set(id, note);
        await RedisService.set(id, JSON.stringify(note));
        res.status(200).json(result.rows[0]);
    }catch(err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to update note" });
    }
};

export const deleteNote = async (req: Request, res: Response) => {
    const { id } = req.params;
    try{
        const result = await pool.query(
            'DELETE FROM notes WHERE id = $1 RETURNING *',
            [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Note not found" });
        }
        Cache.delete(id);
        await RedisService.delete(id)
        res.status(200).json({ message: "Note deleted successfully" });
    }catch(err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to delete note" });
    }
};
