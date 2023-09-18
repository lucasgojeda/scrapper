/** Libraries */
import { Router } from "express";
import { check } from "express-validator";

/** Middlewares */
import { validateFields } from "../middleware/validate.fields.js";
import { jwtValidate } from "../middleware/jwt.validate.js";

/** Controllers */
import { scrapperMLController } from "../controllers/scrapper.controllers.js";

const router = Router();

router.post("/", [jwtValidate, validateFields], scrapperMLController);

export { router as scrapperRouter };
