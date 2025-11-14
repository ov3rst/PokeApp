import connection from "../utils/DbConnection.js";
import PokemonModel from "../models/PokemonModel.js";
import RegionModel from "../models/RegionModel.js";
import TypeModel from "../models/TypeModel.js";

connection
  .authenticate()
  .then(() =>
    console.log("Database connection has been established successfully.")
  )
  .catch((error) => console.error("Unable to connect to the database:", error));

//Relations config
RegionModel.hasMany(PokemonModel, { foreignKey: "regionID" });
PokemonModel.belongsTo(RegionModel, { foreignKey: "regionID" });

// Relations many to many
TypeModel.belongsToMany(PokemonModel, {
  through: { model: "PokeType" },
  foreignKey: "typeID",
  otherKey: "pokemonID",
});
PokemonModel.belongsToMany(TypeModel, {
  through: { model: "PokeType" },
  foreignKey: "pokemonID",
  otherKey: "typeID",
});

export default {
  Sequelize: connection,
  PokemonModel,
  RegionModel,
  TypeModel,
};
