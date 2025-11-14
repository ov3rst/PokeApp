import { DataTypes } from "sequelize";
import connection from "../utils/DbConnection.js";

const Region = connection.define(
  "Region",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { tableName: "Region" }
);

export default Region;
