import { Sequelize } from "sequelize";
import pg from "pg";

declare global {
  var sequelize: Sequelize | undefined;
}

// Initialize or return the existing Sequelize instance
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
      logging: false, // Disable logging for optimization
    }
  );

// // Assign the newly created sequelize instance to the global object
if (!global.sequelize) {
  global.sequelize = sequelize;
}

export default sequelize;
