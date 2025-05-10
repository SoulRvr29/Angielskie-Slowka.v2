import connectDB from "@/config/database";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";

// GET /api/prywatne_zestawy
export const GET = async (request) => {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    // Get the session to identify the logged-in user
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Fetch word sets for the logged-in user
    const zestawy = await User.findOne(
      { _id: session.user.id },
      { wordSets: 1 }
    );

    console.log("Fetched word sets for user:", session.user.email);

    return new Response(JSON.stringify(zestawy), { status: 200 });
  } catch (error) {
    console.error("Error in /api/prywatne_zestawy:", error);
    return new Response("Something went wrong", { status: 500 });
  }
};

// POST /api/prywatne_zestawy
export const POST = async (request) => {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { name, words, category } = await request.json();

    // Find the user by email
    const user = await User.findOne({
      _id: session.user.id,
    });

    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    // Find the category in the user's wordSets
    const categoryIndex = user.wordSets.findIndex(
      (set) => set.category === category
    );

    // If the category exists, add the new set to it
    user.wordSets[categoryIndex].sets.push({ name, words });

    // Save the updated user document
    await user.save();

    console.log("Added new word set for user:", session.user.email);

    return new Response(JSON.stringify(user.wordSets), { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/prywatne_zestawy:", error);
    return new Response("Something went wrong", { status: 500 });
  }
};
