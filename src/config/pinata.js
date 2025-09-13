import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_API_KEY;

if (!PINATA_API_KEY || !PINATA_SECRET_API_KEY) {
  console.error("❌ Pinata API keys missing. Check your .env file.");
  process.exit(1);
}

export const pinata = axios.create({
  baseURL: "https://api.pinata.cloud/",
  headers: {
    pinata_api_key: PINATA_API_KEY,
    pinata_secret_api_key: PINATA_SECRET_API_KEY,
  },
});
