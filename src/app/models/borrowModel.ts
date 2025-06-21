import mongoose, { Schema, model } from "mongoose";
import { Iborrow } from "../interfaces/borrowInterface";
import { Book } from "./bookModel";

const borrowSchema = new Schema<Iborrow>(
  {
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

borrowSchema.pre("validate", function (next) {
  if (!this.dueDate) {
    const defaultDue = new Date();
    defaultDue.setDate(defaultDue.getDate() + 7);
    this.dueDate = defaultDue;
  }
  next();
});

export const Borrow = model("Borrow", borrowSchema);
