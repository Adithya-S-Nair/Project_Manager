import mysql from 'mysql2'
import dotenv from 'dotenv';
dotenv.config();

export const db = mysql.createPool({
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password: "",
    database: process.env.DB_NAME
})
