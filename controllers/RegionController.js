import context from "../context/AppContext.js";

export const GetIndex = (req, res, next) => {
  context.RegionModel.findAll()
    .then((result) => {
      const region = result.map((item) => item.dataValues);

      res.render("region/index", {
        regionList: region,
        hasRegion: region.length > 0,
        "page-title": "regions",
      });
    })
    .catch((err) => console.error("Error fetching regions:", err));
};

export const GetAdd = (req, res, next) => {
  res.render("region/upsert", {
    editMode: false,
    "page-title": "Add Region",
  });
};

export const PostAdd = (req, res, next) => {
  const name = req.body.Name;

  context.RegionModel.create({
    name: name,
  })
    .then(() => res.redirect("/region/index"))
    .catch((err) => {
      console.error("Error creating region:", err);
    });
};

export const GetUpdate = (req, res, next) => {
  const id = req.params.regionID;

  context.RegionModel.findByPk(Number(id))
    .then((result) => {
      if (!result) res.redirect("/region/index");

      const region = result.dataValues;

      res.render("region/upsert", {
        editMode: true,
        region,
        "page-title": `Update region ${region.name}`,
      });
    })
    .catch((err) => console.error("Error fetching region:", err));
};

export const PostUpdate = (req, res, next) => {
  const id = req.body.regionID;
  const name = req.body.Name;

  context.RegionModel.findByPk(Number(id))
    .then((result) => {
      if (!result) res.redirect("/region/index");

      context.RegionModel.update({ name: name }, { where: { id: id } })
        .then(() => res.redirect("/region/index"))
        .catch((err) => console.error("Error updating region:", err));
    })
    .catch((err) => console.error("Error updating region:", err));
};

export const Delete = (req, res, next) => {
  const id = req.body.regionID;

  context.RegionModel.findByPk(Number(id))
    .then((result) => {
      if (!result) res.redirect("/region/index");

      context.RegionModel.destroy({ where: { id: id } })
        .then(() => res.redirect("/region/index"))
        .catch((err) => console.error("Error deleting region:", err));
    })
    .catch((err) => console.error("Error deleting region:", err));
};
