import { Schema, model, models } from "mongoose";

const ZestawSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Nazwa wymagana"],
    },
    category: {
      type: String,
      required: [true, "Nazwa kategorii wymagana"],
    },
    words: [
      {
        english: {
          type: String,
          required: [true, "Dodaj słówko"],
        },
        polish: {
          type: String,
          required: [true, "Dodaj słówko"],
        },
      },
    ],
  },
  { collection: "word_sets" }
);

const WordSets = models.WordSets || model("WordSets", ZestawSchema);
export default WordSets;
