import context from "../context/AppContext.js";
import { Op, Sequelize } from "sequelize";

export const GetIndex = (req, res, next) => {
  context.PokemonModel.findAll({
    include: [
      { model: context.RegionModel, attributes: ["name"] },
      {
        model: context.TypeModel,
        through: {
          attributes:
            [] /*through:{attributes: []} esto oculta la tabla intermedia */,
        },
        attributes: ["name"],
      },
    ],
  })
    .then((result) => {
      // const pokemon = result.map((item) => item.dataValues);
      const pokemon = result.map((item) => item.toJSON());

      context.RegionModel.findAll()
        .then((result) => {
          if (!result) res.redirect("region/index");

          const regions = result.map((item) => item.dataValues);
          context.TypeModel.findAll()
            .then((result) => {
              if (!result) res.redirect("type/index");

              const types = result.map((item) => item.dataValues);

              res.render("home/home", {
                pokemonList: pokemon,
                hasPokemon: pokemon.length > 0,
                regions,
                types,
                "page-title": "Pokemons Home",
              });
            })
            .catch((err) => console.log("Error fetching regions:", err));
        })
        .catch((err) => console.log("Error fetching types:", err));
    })
    .catch((err) => console.error("Error fetching pokemons:", err));
};

export const GetByFilter = (req, res, next) => {
  // Normalizar filtros a arrays y convertir a números
  const filterTypes = req.query.types
    ? Array.isArray(req.query.types)
      ? req.query.types.map(Number)
      : [Number(req.query.types)]
    : [];

  const filterRegions = req.query.regions
    ? Array.isArray(req.query.regions)
      ? req.query.regions.map(Number)
      : [Number(req.query.regions)]
    : [];

  console.log("Filtros aplicados:", { filterTypes, filterRegions });

  const whereClause = {};
  if (filterRegions.length > 0) {
    whereClause.regionID = { [Op.in]: filterRegions };
  }

  if (filterTypes.length > 0) {
    whereClause.id = {
      [Op.in]: Sequelize.literal(`(
        SELECT DISTINCT pokemonID 
        FROM pokeType 
        WHERE typeID IN (${filterTypes.join(",")})
      )`),
    };
  }

  context.PokemonModel.findAll({
    where: whereClause,
    include: [
      {
        model: context.RegionModel,
        attributes: ["name"],
      },
      {
        model: context.TypeModel,
        through: { attributes: [] },
        attributes: ["id", "name"],
      },
    ],
    order: [["id", "ASC"]], // Opcional: ordenar por ID
  })
    .then((pokemons) => {
      console.log(`Pokémon encontrados: ${pokemons.length}`);

      return Promise.all([
        Promise.resolve(pokemons.map((p) => p.toJSON())),
        context.RegionModel.findAll(),
        context.TypeModel.findAll(),
      ]);
    })
    .then(([pokemonList, regions, types]) => {
      res.render("home/home", {
        pokemonList: pokemonList,
        hasPokemon: pokemonList.length > 0,
        regions: regions.map((r) => r.toJSON()),
        types: types.map((t) => t.toJSON()),
        "page-title": "Pokemons Home",
      });
    })
    .catch((err) => {
      console.error("Error en GetByFilter:", err);
      res.status(500).send("Error al filtrar pokémon");
    });
};
