/** Libraries */
import { Schema, model } from "mongoose";

const reportSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  productsQuantity: {
    type: Number,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

reportSchema.methods.toJSON = function () {
  const { __v, ...report } = this.toObject();
  return report;
};

const Report = model("Report", reportSchema);
export default Report;
