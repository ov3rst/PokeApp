import { Sequelize } from "sequelize";
import { projectRoot } from "./paths.js";
import path from "path";

let connection;

if (process.env.DB_DIALECT === "sqlite") {
  connection = new Sequelize("sqlite:db.sqlite", {
    dialect: process.env.DB_DIALECT,
    storage: path.join(
      projectRoot,
      process.env.DB_FOLDER,
      process.env.DB_FILENAME
    ),
  });
} else if (process.env.DB_DIALECT === "mysql") {
  connection = new Sequelize(
    "Pokedex",
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      dialect: process.env.DB_DIALECT,
      host: "localhost",
      port: 3306,
    }
  );
} else {
  throw new Error("Unsupported DB_DIALECT: " + process.env.DB_DIALECT);
}

export default connection;
