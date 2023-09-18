/** Libraries */
import jwt from "jsonwebtoken";

/** Models */
import User from "../models/user.model.js";

export const jwtValidate = async (req, res, next) => {
  try {
    const token = req.header("x-token");

    if (!token || token === undefined) {
      return res.status(401).json({
        msg: "There is no token in the request",
      });
    }

    const { id } = jwt.verify(token, process.env.JWT_SECRETORPRIVATEKEY);

    req.id = id;

    const user = await User.findById(id).populate({
      path: "reports",
    });

    req.user = user;

    next();
  } catch (err) {
    res.status(401).json({
      msg: "invalid token.",
      err,
    });
  }
};
