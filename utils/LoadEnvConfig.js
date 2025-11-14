import dotenv from "dotenv";
import path from "path";
import { projectRoot } from "./paths.js";

const envPath = path.join(
  projectRoot,
  `.env${process.env.NODE_ENV ? `.${process.env.NODE_ENV}` : ""}`
);

dotenv.config({ path: envPath });
