/** Libraries */
import bcrypt from "bcryptjs";

/** Models */
import User from "../models/user.model.js";

/** Utils */
import { jwtGenerate } from "../utils/jwt.generate.js";

export const loginService = async ({ email, password }) => {
  const user = await User.findOne({ email }).populate({ path: "reports" });

  if (!user || !(await bcrypt.compare(password, user.password))) return null;

  const token = await jwtGenerate(user._id);
  return {
    user,
    token,
  };
};

export const signUpService = async ({ username, email, password }) => {
  try {
    const userNew = new User({ username, email, password });

    const salt = bcrypt.genSaltSync();
    userNew.password = bcrypt.hashSync(password, salt);

    const userNewFinish = await userNew.save();

    const token = await jwtGenerate(userNewFinish.id);

    return {
      msg: "OK",
      user: userNewFinish,
      token,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const renewService = async (user) => {
  const { id } = user;

  const token = await jwtGenerate(id);

  return {
    user,
    token,
  };
};
