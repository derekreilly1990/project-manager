const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  title: { type: String, required: true },
  managerName: { type: String, required: true },
  description: { type: String, required: true },
  progress: { type: String, required: true },
  created: { type: Date, default: Date.now },
  startDate: Date,
  expectedEndDate: Date,
  actualEndDate: Date,
  mainImageUrl: String,
  updated: Date,
});

schema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    // remove these props when object is serialized
    delete ret._id;
  },
});

module.exports = mongoose.model("Project", schema);
