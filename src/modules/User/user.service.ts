import bcrypt from "bcryptjs";
import { pool } from "../../db";
import type { IUser } from "./user.interface";





const createUserIntoDB = async (payload: IUser) => {
  const { name, email, password, role } = payload;

  const hashPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(`INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, COALESCE($4, 'contributor')) RETURNING *`, [name, email, hashPassword, role]);
  delete result.rows[0].password;
  return result;
}

const getAllUsersFromDB = async () => {
  const result = await pool.query(`
      SELECT * FROM users;
      `)
  return result;
}

const getSingleUserFromDB = async (id: number) => {
  const result = await pool.query(`
      SELECT * FROM users WHERE id = $1
      `, [id])
  return result
}

const updateUserFromDB = async (id: number, payload: IUser) => {
  const { name, email, password, role } = payload;
  const result = await pool.query(`
        UPDATE users SET name = COALESCE($1, name), email = COALESCE($2, email), password = COALESCE($3, password), role = COALESCE($4, role) WHERE id = $5 RETURNING *;  
        `,
    [name, email, password, role, id]
  )
  return result;
}

export const userService = {
  createUserIntoDB,
  getAllUsersFromDB,
  getSingleUserFromDB,
  updateUserFromDB
}