import { Schema, model, models } from "mongoose";

const ZestawUserSchema = new Schema(
  {
    user_name: {
      type: String,
      required: [true, "Nazwa wymagana"],
    },
    user_sets: [
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
    ],
  },
  { collection: "user_sets" }
);

const UserSets = models.UserSets || model("UserSets", ZestawUserSchema);
export default UserSets;
