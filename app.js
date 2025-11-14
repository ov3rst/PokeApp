import "./utils/LoadEnvConfig.js";
import express from "express";
import context from "./context/AppContext.js";
import { engine } from "express-handlebars";
import path from "path";
import { projectRoot } from "./utils/paths.js";
import HomeRouter from "./routes/HomeRoutes.js";
import PokemonRouter from "./routes/PokemonRoutes.js";
import RegionRouter from "./routes/RegionRoutes.js";
import TypeRouter from "./routes/TypeRoutes.js";
import { GetSection } from "./utils/helpers/hbs/Section.js";
import { IsSelected } from "./utils/helpers/hbs/IsSelected.js";
import ShowTypes from "./utils/helpers/hbs/ShowPokemonTypes.js";
import { IsTypeSelected } from "./utils/helpers/hbs/IsTypeSelected.js";

const app = express();

app.engine(
  "hbs",
  engine({
    layoutsDir: "views/layouts",
    partialsDir: "views/partials",
    defaultLayout: "main-layout",
    extname: "hbs",
    helpers: {
      section: GetSection,
      IsSelected,
      ShowTypes,
      IsTypeSelected,
    },
  })
);

app.set("view engine", "hbs");
app.set("views", "views");

app.use(express.urlencoded({ extended: true })); //La opcion extended en true lo que asegura entre otras cosas que los grupos de checkbox lleguen siempre como un array aunque este un solo checkbox seleccionado
app.use(express.static(path.join(projectRoot, "public")));

//routes
app.use(HomeRouter);
app.use("/pokemon", PokemonRouter);
app.use("/region", RegionRouter);
app.use("/type", TypeRouter);

//Not Found
app.use((req, res) => {
  res.status(404).render("404", { "page-title": "404 Not Found" });
});

//Configure context
context.Sequelize.sync() // Use force: true to drop and recreate tables { force: true } or alter: true to update the schema without losing data {alter: true}
  .then(() => {
    const port = process.env.PORT || 8080;
    app.listen(port);
    console.log(`Aplicación corriendo en el puerto ${port}`);
  })
  .catch((error) => console.error("Error connecting to the database:", error));
