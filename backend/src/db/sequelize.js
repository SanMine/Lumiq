import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || "mysql",
    logging: false
  }
);

export async function connectDb() {
  try {
    await sequelize.authenticate();
    console.log("✅ DB connection OK");
  } catch (err) {
    console.error("❌ DB connection failed:", err.message);
    throw err;
  }
}
