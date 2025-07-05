import { model, Schema, Model } from "mongoose";
import { Ibook } from "../interfaces/bookInterface";

const bookSchema = new Schema<Ibook>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    author: {
      type: String,
      required: [true, "Author is required"],
    },
    genre: {
      type: String,
      enum: [
        "FICTION",
        "NON_FICTION",
        "SCIENCE",
        "HISTORY",
        "BIOGRAPHY",
        "FANTASY",
      ],
      required: true,
    },
    isbn: {
      type: String,
      unique: true,
      required: true,
    },
    description: {
      type: String,
    },
    copies: {
      type: Number,
      min: [0, "Copies must be a positive number"],
      required: true,
    },
    available: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
bookSchema.methods.updateAvailability = function (this: Ibook): void {
  this.available = this.copies > 0;
};

export const Book: Model<Ibook> = model<Ibook>("Book", bookSchema);
