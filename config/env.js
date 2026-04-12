import dotenv from 'dotenv'
dotenv.config()

export const CONFIG = {
  MODE: process.env.MODE || "DUAL", // SINGLE / DUAL
}
