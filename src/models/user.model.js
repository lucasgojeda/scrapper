/** Libraries */
import { Schema, model } from "mongoose";

const UserSchema = Schema({
  username: {
    type: String,
    required: [true, "Username is required."],
  },
  email: {
    type: String,
    required: [true, "Email is required."],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required."],
  },
  reports: [
    {
      type: Schema.Types.ObjectId,
      ref: "Report",
    },
  ],
  status: {
    type: Boolean,
    default: true,
  },
});

UserSchema.methods.toJSON = function () {
  const { __v, password, ...user } = this.toObject();
  return user;
};

const User = model("User", UserSchema);
export default User;
