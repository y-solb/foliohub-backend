import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import routes from "./routes";
import cors from "cors";

dotenv.config();

const app: Express = express();
app.use(cors());
app.use("/", routes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`[server]: Server is running at https://localhost:${port}`);
});
