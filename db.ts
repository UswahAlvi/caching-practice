import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();
if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined in .env');
}

export const pool = new pg.Pool({connectionString: process.env.DATABASE_URL});


