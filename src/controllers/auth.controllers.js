/** Services */
import {
  loginService,
  renewService,
  signUpService,
} from "../services/auth.services.js";

/** Utils */
import { handleError } from "../utils/handle.errors.js";

export const signUpController = async (req, res) => {
  const data = await signUpService(req.body);
  if (!data) {
    return handleError(res, "Something Went Wrong", {}, 400);
  }
  const { user, token } = data;
  res.status(200).json({
    user,
    token,
  });
};

export const loginController = async (req, res) => {
  const data = await loginService(req.body);
  if (!data) {
    handleError(res, "Invalid email or password", {}, 403);
    return;
  }

  const { user, token } = data;
  res.status(200).json({
    user,
    token,
  });
};

export const tokenRevalidate = async (req, res) => {
  const { user: reqUser } = req;
  const data = await renewService(reqUser);
  if (data == null) {
    handleError(res, "Request failed", {}, 403);
    return;
  }
  const { user, token } = data;
  res.status(200).json({
    msg: "OK",
    user,
    token,
  });
};
