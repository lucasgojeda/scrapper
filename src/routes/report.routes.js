/** Libraries */
import { Router } from "express";

/** Controllers */
import { getReportsController } from "../controllers/report.controllers.js";

/** Middlewares */
import { validateFields } from "../middleware/validate.fields.js";
import { jwtValidate } from "../middleware/jwt.validate.js";

const router = Router();

router.get("/", [jwtValidate, validateFields], getReportsController);

export { router as reportRouter };
