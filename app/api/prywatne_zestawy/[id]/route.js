import connectDB from "@/config/database";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";

// GET /api/prywatne_zestawy/:id
export const GET = async (request, { params }) => {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    // Get the session to identify the logged-in user
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    const user = await User.findOne(
      { _id: session.user.id, "wordSets.sets._id": params.id },
      {
        "wordSets.sets.$": 1, // Fetch only the matching set
        "wordSets.category": 1, // Include the parent category field
      }
    );

    if (!user) return new Response("Not found", { status: 404 });

    const matchingWordSet = user.wordSets.find((ws) =>
      ws.sets.some((set) => set._id.toString() === params.id)
    );

    if (!matchingWordSet) return new Response("Not found", { status: 404 });

    const matchingSet = matchingWordSet.sets.find(
      (set) => set._id.toString() === params.id
    );

    const zestawNew = {
      id: matchingSet._id,
      category: matchingWordSet.category,
      name: matchingSet.name,
      words: matchingSet.words,
    };

    console.log("Fetched word set");
    return new Response(JSON.stringify(zestawNew), { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/prywatne_zestawy/:id", error);
    return new Response("Something went wrong", { status: 500 });
  }
};

// DELETE /api/prywatne_zestawy/:id
export const DELETE = async (request, { params }) => {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    // Get the session to identify the logged-in user
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    const updatedUser = await User.updateOne(
      { _id: session.user.id, "wordSets.sets._id": params.id },
      { $pull: { "wordSets.$[].sets": { _id: params.id } } }
    );

    if (updatedUser.modifiedCount === 0)
      return new Response("Not found", { status: 404 });

    console.log("Deleted word set");
    return new Response("Deleted successfully", { status: 200 });
  } catch (error) {
    console.error("Error in DELETE /api/prywatne_zestawy/:id", error);
    return new Response("Something went wrong", { status: 500 });
  }
};
