/** Models */
import User from "../models/user.model.js";

export const emailExists = async (email = "") => {
  const emailConflict = await User.findOne({ email });

  if (emailConflict) {
    throw new Error(`The email '${email}' is already registered.`);
  }
};
