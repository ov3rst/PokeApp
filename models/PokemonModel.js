import { DataTypes } from "sequelize";
import connection from "../utils/DbConnection.js";

const Pokemon = connection.define(
  "Pokemon",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    photoUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    regionID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Region", // Name of the referenced model
        key: "id", // Key in the referenced model
      },
      onDelete: "CASCADE", // Optional: define behavior on delete
      onUpdate: "CASCADE", // Optional: define behavior on update
    },
  },
  {
    tableName: "Pokemon",
  }
);

export default Pokemon;
