const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  title: { type: String, required: true },
  managerName: { type: String, required: true },
  description: { type: String, required: true },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
  },
  subscribers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
    },
  ],
  mainImageUrl: String,
  progress: { type: Number, required: true },
  created: { type: Date, default: Date.now },
  startDate: Date,
  expectedEndDate: Date,
  actualEndDate: Date,
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
