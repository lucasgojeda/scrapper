/** Libraries */
import { Router } from "express";
import { check } from "express-validator";

/** Controllers */
import { scrapperMLController } from "../controllers/scrapper.controllers.js";

const router = Router();

router.post("/", scrapperMLController);

export { router as scrapperRouter };
