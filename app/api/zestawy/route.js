import connectDB from "@/config/database";
import User from "@/models/User";

// GET /api/zestawy/wlasne
export const GET = async (request) => {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    const zestawy = await User.findOne(
      { email: process.env.NEXT_PUBLIC_ADMIN_EMAIL },
      { wordSets: 1 }
    );

    console.log(
      "Fetched word sets for user:",
      process.env.NEXT_PUBLIC_ADMIN_EMAIL
    );

    return new Response(JSON.stringify(zestawy), { status: 200 });
  } catch (error) {
    console.error("Error in /api/zestawy/wlasne:", error);
    return new Response("Something went wrong", { status: 500 });
  }
};

// POST /api/zestawy
export const POST = async (request) => {
  try {
    await connectDB();

    const { name, words, category } = await request.json();

    // Find the user by email
    const user = await User.findOne({
      email: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
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

    console.log(
      "Added new word set for user:",
      process.env.NEXT_PUBLIC_ADMIN_EMAIL
    );

    return new Response(JSON.stringify(user.wordSets), { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/zestawy:", error);
    return new Response("Something went wrong", { status: 500 });
  }
};
