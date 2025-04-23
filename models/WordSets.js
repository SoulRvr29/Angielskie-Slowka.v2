import { Schema, model, models } from "mongoose";

const WordSchema = new Schema({
  english: {
    type: String,
    required: [true, "Dodaj słówko"],
  },
  polish: {
    type: String,
    required: [true, "Dodaj słówko"],
  },
});

const SetSchema = new Schema({
  name: {
    type: String,
    required: [true, "Nazwa zestawu wymagana"],
  },
  words: [WordSchema],
});

const WordSetsSchema = new Schema(
  {
    category: {
      type: String,
      required: [true, "Nazwa kategorii wymagana"],
    },
    sets: [SetSchema],
  },
  { collection: "word_sets" }
);

const WordSets = models.WordSets || model("WordSets", WordSetsSchema);
export default WordSets;
