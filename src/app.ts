import express from 'express';
import dotenv from 'dotenv';
import { pool } from '../db';
import router from './notes/routes';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

async function connectServer() {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT NOW()');
        client.release();

        const connection = result.rows[0];
        if (!connection) {
            console.error('No DB connection found');
            process.exit(1);
        }

        app.use('/api', router);
        app.listen(port, () => {
            console.log(`Express is listening at http://localhost:${port}`);
        });
    } catch (error) {
        console.error('Error connecting to the database:', error);
        process.exit(1);
    }
}

connectServer();