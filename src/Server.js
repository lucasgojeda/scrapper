/** Libraries */
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import chalk from "chalk";
import logger from "morgan";

/** Database */
import { dbConnect } from "./config/mongo.js";

/** Routes */
import { authRouter } from "./routes/auth.routes.js";
import { scrapperRouter } from "./routes/scrapper.routes.js";

/** Utils */
import { log } from "./utils/logger.js";
import { reportRouter } from "./routes/report.routes.js";

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.paths = {
      auth: "/api/auth",
      reports: "/api/reports",
      scrapper: "/api/scrapper",
    };

    this.conectarDB();

    this.middlewares();

    this.routes();
  }

  async conectarDB() {
    await dbConnect();
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
    this.app.use(this.paths.auth, authRouter);
    this.app.use(this.paths.reports, reportRouter);
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
