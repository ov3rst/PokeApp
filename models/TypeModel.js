import { DataTypes } from "sequelize";
import connection from "../utils/DbConnection.js";

const Type = connection.define(
  "Type",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { tableName: "Type" }
);

export default Type;
