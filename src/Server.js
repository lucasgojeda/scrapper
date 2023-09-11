/** Libraries */
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import chalk from "chalk";
import logger from "morgan";

/** Database */
// const { dbConnection } = require('../database/config')

/** Routes */
import { scrapperRouter } from "./routes/scrapper.routes.js.js";

/** Utils */
import { log } from "./utils/logger.js";

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.paths = {
      scrapper: "/api/scrapper",
    };

    this.conectarDB();

    this.middlewares();

    this.routes();
  }

  async conectarDB() {
    // await dbConnection()
  }

  middlewares() {
    this.app.use(cors());

    this.app.use(logger("dev"));
    this.app.use(cookieParser());

    //Reading and parsing of the body.
    this.app.use(bodyParser.json({ limit: "50mb" }));
    this.app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
    this.app.use(express.json());
  }

  routes() {
    this.app.use(this.paths.scrapper, scrapperRouter);
  }
  listen() {
    this.app.listen(this.port, () => {
      log.info(
        `${chalk.white("Server listening on port")} ${chalk.cyan(this.port)}`
      );
    });
  }
}

export default Server;
