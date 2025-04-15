import { Schema, model, models } from "mongoose";

const ZestawSchema = new Schema(
  {
    name: {
      type: String,
      unique: [true, "Zestaw o tej nazwie już istnieje"],
      required: [true, "Nazwa wymagana"],
    },
    words: [
      {
        english: {
          type: String,
          unique: [true, "To słówko już istnieje"],
          required: [true, "Dodaj słówko"],
        },
        polish: {
          type: String,
          unique: [true, "To słówko już istnieje"],
          required: [true, "Dodaj słówko"],
        },
      },
    ],
  },
  { collection: "word_sets" }
);

const WordSets = models.WordSets || model("WordSets", ZestawSchema);
export default WordSets;
