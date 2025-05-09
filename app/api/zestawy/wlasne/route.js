import connectDB from "@/config/database";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";

// GET /api/zestawy/wlasne
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
    console.error("Error in /api/zestawy/wlasne:", error);
    return new Response("Something went wrong", { status: 500 });
  }
};

// POST /api/zestawy/wlasne
export const POST = async (request) => {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { name, words } = await request.json();

    // Add the word set for the logged-in user
    const newSet = await UserSets.findOneAndUpdate(
      { _id: session.user.id },
      {
        $push: { sets: { name, words } },
      },
      { new: true, upsert: true }
    );

    console.log("Added new word set for user:", session.user.email);

    return new Response(JSON.stringify(newSet), { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/zestawy/wlasne:", error);
    return new Response("Something went wrong", { status: 500 });
  }
};
