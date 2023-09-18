/** Libraries */
import { Router } from "express";
import { check } from "express-validator";

/** Middlewares */
import { validateFields } from "../middleware/validate.fields.js";
import { jwtValidate } from "../middleware/jwt.validate.js";

/** Controllers */
import {
  signUpController,
  loginController,
  tokenRevalidate,
} from "../controllers/auth.controllers.js";

/** Utils */
import { emailExists } from "../utils/db.validator.js";

const router = Router();

router.post(
  "/signup",
  [
    check("username", "Username is required.").not().isEmpty(),
    check("password", "Password most be at least of 6 lenght.").isLength({
      min: 6,
    }),
    check("email", "The email is not valid").isEmail(),
    check("email").custom(emailExists),
    validateFields,
  ],
  signUpController
);

router.post(
  "/login",
  [
    check(
      "email",
      "Email is required and it should be an email valid."
    ).isEmail(),
    check("password", "Password most be at least of 6 lenght.").isLength({
      min: 6,
    }),
    validateFields,
  ],
  loginController
);

router.get("/renew", [jwtValidate, validateFields], tokenRevalidate);

export { router as authRouter };
