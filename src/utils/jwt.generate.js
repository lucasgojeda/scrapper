/** Libraires */
import jwt from "jsonwebtoken";

export const jwtGenerate = (id = "") => {
  return new Promise((resolve, reject) => {
    const payload = { id };

    jwt.sign(
      payload,
      process.env.JWT_SECRETORPRIVATEKEY,
      {
        expiresIn: "4h",
      },
      (err, token) => {
        if (err) {
          console.log(err);
          reject("Failed to generate token");
        } else {
          resolve(token);
        }
      }
    );
  });
};
