/** Libraries */
const { Schema, model } = require("mongoose");

const reportSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
    unique: true,
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

module.exports = model("Report", reportSchema);
