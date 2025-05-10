import connectDB from "@/config/database";
import User from "@/models/User";

// PUT /api/publiczne_zestawy/[id]/edycja
export const PUT = async (request, { params }) => {
  try {
    await connectDB();

    console.log("Connected to MongoDB");

    const body = await request.json();
    const id = params.id;
    const { updateData } = body;

    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

    const updatedUser = await User.updateOne(
      {
        email: adminEmail,
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
    console.error("Error in PUT /api/publiczne_zestawy:", error);
    return new Response("Something went wrong", { status: 500 });
  }
};
