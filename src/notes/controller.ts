import { pool } from "../../db";
import { Request, Response } from "express";
import {Cache} from '../services/nodeCacheService'
export const getNotes = async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM notes');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch notes" });
    }
};

export const getNoteById =async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM notes WHERE id = $1', [id]);
        if(!Cache.has(id)){
            Cache.set(id, result.rows[0]);
        }
        res.status(200).json(result.rows[0]);
    }catch(err) {
        console.error(err);
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
        res.status(200).json({ message: "Note deleted successfully" });
    }catch(err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to delete note" });
    }
};
