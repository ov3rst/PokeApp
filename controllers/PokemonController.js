import context from "../context/AppContext.js";

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

      res.render("pokemon/index", {
        pokemonList: pokemon,
        hasPokemon: pokemon.length > 0,
        "page-title": "Pokemons",
      });
    })
    .catch((err) => console.error("Error fetching pokemons:", err));
};

export const GetAdd = (req, res, next) => {
  context.RegionModel.findAll()
    .then((result) => {
      if (!result) res.redirect("pokemon/index");

      const regions = result.map((item) => item.dataValues);
      context.TypeModel.findAll()
        .then((result) => {
          if (!result) res.redirect("pokemon/index");

          const types = result.map((item) => item.dataValues);

          res.render("pokemon/upsert", {
            editMode: false,
            regions,
            types,
            "page-title": "Add Pokemon",
          });
        })
        .catch((err) => console.log("Error fetching regions:", err));
    })
    .catch((err) => console.log("Error fetching types:", err));
};

export const PostAdd = (req, res, next) => {
  const name = req.body.Name;
  const photoUrl = req.body.pokemonImage;
  const region = req.body.region;
  const types = [req.body.firstType, req.body.secondType];

  // TODOHay que validar que los tipos elegidos sean diferentes
  context.PokemonModel.create({
    name: name,
    photoUrl: photoUrl,
    regionID: region,
  })
    .then((pokemon) => pokemon.addTypes(types))
    .then(() => res.redirect("/pokemon/index"))
    .catch((err) => {
      console.error("Error creating pokemon:", err);
    });
};

export const GetUpdate = (req, res, next) => {
  const id = req.params.pokemonID;

  context.PokemonModel.findOne({
    where: { id: id },
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
      if (!result) res.redirect("/pokemon/index");

      const pokemon = result.toJSON();
      // console.log(pokemon);

      context.RegionModel.findAll()
        .then((result) => {
          if (!result) res.redirect("pokemon/index");

          const regions = result.map((item) => item.dataValues);
          context.TypeModel.findAll()
            .then((result) => {
              if (!result) res.redirect("pokemon/index");

              const types = result.map((item) => item.toJSON());

              res.render("pokemon/upsert", {
                editMode: true,
                pokemon,
                regions,
                types,
                firstType: pokemon.Types[0].name,
                secondType: pokemon.Types[1].name,
                "page-title": `Update pokemon ${pokemon.name}`,
              });
            })
            .catch((err) => console.log("Error fetching regions:", err));
        })
        .catch((err) => console.log("Error fetching types:", err));
    })
    .catch((err) => console.error("Error fetching pokemon:", err));
};

export const PostUpdate = (req, res, next) => {
  const id = req.body.pokemonID;
  const name = req.body.Name;
  const photoUrl = req.body.image;
  const region = req.body.region;
  const types = [req.body.firstType, req.body.secondType];

  context.PokemonModel.findByPk(Number(id), {
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
    .then((pokemon) => {
      if (!pokemon) res.redirect("/pokemon/index");

      //Validando que los tipos no sean iguales
      if (types[0] === types[1]) {
        return Promise.all([
          context.RegionModel.findAll(),
          context.TypeModel.findAll(),
        ]).then(([regions, allTypes]) => {
          const allRegions = regions.map((item) => item.toJSON());
          const newTypes = allTypes.map((item) => item.toJSON());
          res.render("pokemon/upsert", {
            editMode: true,
            error: "Un pokemon no puede tener 2 tipos iguales",
            pokemon: pokemon.toJSON(),
            regions: allRegions,
            types: newTypes,
            firstType: pokemon.Types[0].name,
            secondType: pokemon.Types[1].name,
            "page-title": `Update pokemon ${pokemon.name}`,
          });
        });
      }

      pokemon
        .update(
          { name: name, photoUrl: photoUrl, regionID: region },
          { where: { id: id } }
        )
        .then(() => {
          return pokemon.setTypes(types);
        })
        .then(() => res.redirect("/pokemon/index"))
        .catch((err) => console.error("Error updating pokemon:", err));
    })
    .catch((err) => console.error("Error updating pokemon:", err));
};

export const Delete = (req, res, next) => {
  const id = req.body.pokemonID;

  context.PokemonModel.findByPk(Number(id))
    .then((result) => {
      if (!result) res.redirect("/pokemon/index");

      context.PokemonModel.destroy({ where: { id: id } })
        .then(() => res.redirect("/pokemon/index"))
        .catch((err) => console.error("Error deleting pokemon:", err));
    })
    .catch((err) => console.error("Error deleting pokemon:", err));
};
