import { Sequelize } from "sequelize";
import pg from "pg";

declare global {
  var sequelize: Sequelize | undefined;
}

const sequelize =
  global.sequelize ||
  new Sequelize(
    process.env.DB_NAME!,
    process.env.DB_USER!,
    process.env.DB_PASSWORD!,
    {
      host: process.env.DB_HOST!,
      port: Number(process.env.DB_PORT!),
      dialect: "postgres",
      dialectModule: pg,
      logging: false,
    }
  );

if (!global.sequelize) {
  global.sequelize = sequelize;
}

export default sequelize;
