import connectDB from "@/config/database";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";

// PUT /api/zestawy/[id]/edycja
export const PUT = async (request, { params }) => {
  try {
    await connectDB();

    console.log("Connected to MongoDB");

    // Get the session to identify the logged-in user
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return new Response("Unauthorized", { status: 401 });
    }
    const body = await request.json();
    const id = params.id;
    const { updateData } = body;

    const updatedUser = await User.updateOne(
      {
        _id: session.user.id,
        "wordSets.sets._id": id,
      },
      {
        $set: {
          "wordSets.$[wordSet].sets.$[set].name": updateData.name,
          "wordSets.$[wordSet].sets.$[set].words": updateData.words,
        },
      },
      {
        arrayFilters: [{ "wordSet.sets._id": id }, { "set._id": id }],
      }
    );

    if (!updatedUser.modifiedCount) {
      return new Response("Word set not found or not updated", { status: 404 });
    }

    console.log("Updated word set");

    return new Response(JSON.stringify(updatedUser), { status: 200 });
  } catch (error) {
    console.error("Error in PUT /api/zestawy:", error);
    return new Response("Something went wrong", { status: 500 });
  }
};
