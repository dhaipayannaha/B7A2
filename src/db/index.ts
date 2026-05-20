import { Pool } from "pg";
import config from "../config/index.js";


export const pool = new Pool({
  connectionString: config.database.connectionString
})


export const initDB = async () => {
    try {
        await pool.query(`CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(50),
            email VARCHAR(50),
            password text NOT NULL,
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
            )`);

        console.log("Users table created successfully.")
    } catch (error: any) {
        console.log(error)
    }
}