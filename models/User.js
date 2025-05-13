import { Schema, model, models, set } from "mongoose";

const UserSchema = new Schema(
  {
    email: {
      type: String,
      unique: [true, "Email already exists"],
      required: [true, "Email is required"],
    },
    username: {
      type: String,
      required: [true, "Username is required"],
    },
    image: {
      type: String,
    },
    wordSets: [
      {
        category: {
          type: String,
          required: [true, "Category is required"],
        },
        sets: [
          {
            name: {
              type: String,
              required: [true, "Name is required"],
            },
            words: [
              {
                english: { type: String, required: true },
                polish: { type: String, required: true },
              },
            ],
          },
        ],
      },
    ],
    wordsToLearn: [
      {
        english: { type: String, required: true },
        polish: { type: String, required: true },
      },
    ],
    wordsKnown: [
      {
        english: { type: String, required: true },
        polish: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  },
  { collection: "users" }
);

const User = models.User || model("User", UserSchema);

export default User;
