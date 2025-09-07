import { sequelize } from "../../sequelize.js";

try {
  await sequelize.authenticate();
  console.log("✅ DB connected!");
} catch (e) {
  console.error("❌ DB connection error (full):", e);
  console.error("Message:", e?.message);
} finally {
  await sequelize.close();
  process.exit(0);
}
