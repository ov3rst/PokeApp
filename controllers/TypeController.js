import context from "../context/AppContext.js";

export const GetIndex = (req, res, next) => {
  context.TypeModel.findAll()
    .then((result) => {
      const type = result.map((item) => item.dataValues);

      res.render("type/index", {
        typeList: type,
        hasType: type.length > 0,
        "page-title": "types",
      });
    })
    .catch((err) => console.error("Error fetching types:", err));
};

export const GetAdd = (req, res, next) => {
  res.render("type/upsert", {
    editMode: false,
    "page-title": "Add type",
  });
};

export const PostAdd = (req, res, next) => {
  const name = req.body.Name;

  context.TypeModel.create({
    name: name,
  })
    .then(() => res.redirect("/type/index"))
    .catch((err) => {
      console.error("Error creating type:", err);
    });
};

export const GetUpdate = (req, res, next) => {
  const id = req.params.typeID;

  context.TypeModel.findOne({
    where: { id: id },
  })
    .then((result) => {
      if (!result) res.redirect("/type/index");

      const type = result.dataValues;

      res.render("type/upsert", {
        editMode: true,
        type,
        "page-title": `Update type ${type.name}`,
      });
    })
    .catch((err) => console.error("Error fetching type:", err));
};

export const PostUpdate = (req, res, next) => {
  const id = req.body.typeID;
  const name = req.body.Name;

  context.TypeModel.findByPk(Number(id))
    .then((result) => {
      if (!result) res.redirect("/type/index");

      context.TypeModel.update({ name: name }, { where: { id: id } })
        .then(() => res.redirect("/type/index"))
        .catch((err) => console.error("Error updating type:", err));
    })
    .catch((err) => console.error("Error updating type:", err));
};

export const Delete = (req, res, next) => {
  const id = req.body.typeID;

  context.TypeModel.findByPk(Number(id))
    .then((result) => {
      if (!result) res.redirect("/type/index");

      context.TypeModel.destroy({ where: { id: id } })
        .then(() => res.redirect("/type/index"))
        .catch((err) => console.error("Error deleting type:", err));
    })
    .catch((err) => console.error("Error deleting type:", err));
};
