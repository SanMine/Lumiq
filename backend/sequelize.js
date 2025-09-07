import { config } from "dotenv";
import { Sequelize } from "sequelize";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, ".env") });

const ssl =
  process.env.DB_SSL === "true"
    ? { ssl: { require: true, rejectUnauthorized: false } }
    : {};

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    dialect: process.env.DB_DIALECT || "mysql",
    logging: false,
    dialectOptions: ssl
  }
);

