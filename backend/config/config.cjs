// backend/config/config.cjs
require("dotenv").config();

const common = {
  dialect: "mysql",
  logging: false,
  dialectOptions: process.env.DB_SSL === "true"
    ? { ssl: { require: true, rejectUnauthorized: false } }
    : {}
};

const fromParts = () => ({
  ...common,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

const fromUrl = () => ({
  ...common,
  use_env_variable: "DATABASE_URL"
});

const cfg = process.env.DATABASE_URL ? fromUrl() : fromParts();

module.exports = {
  development: cfg,
  test: cfg,
  production: cfg
};
