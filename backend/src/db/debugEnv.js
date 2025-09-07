import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, "../../.env") });

console.log("Environment variables:");
console.log("DB_NAME:", process.env.DB_NAME);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD ? "***" + process.env.DB_PASSWORD.slice(-4) : "undefined");
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_PORT:", process.env.DB_PORT);
console.log("DB_DIALECT:", process.env.DB_DIALECT);
console.log("DB_SSL:", process.env.DB_SSL);

console.log("\nParsed port:", Number(process.env.DB_PORT || 3306));
console.log("Port type:", typeof Number(process.env.DB_PORT || 3306));
