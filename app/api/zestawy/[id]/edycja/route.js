import connectDB from "@/config/database";
import WordSets from "@/models/WordSets";

// PUT /api/zestawy/[id]/edycja
export const PUT = async (request, { params }) => {
  try {
    await connectDB();

    console.log("Connected to MongoDB");

    const body = await request.json();
    const id = params.id;
    const { updateData } = body;

    const updatedWordSet = await WordSets.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedWordSet) {
      return new Response("Word set not found", { status: 404 });
    }

    console.log("Updated word set");

    return new Response(JSON.stringify(updatedWordSet), { status: 200 });
  } catch (error) {
    console.error("Error in PUT /api/zestawy:", error);
    return new Response("Something went wrong", { status: 500 });
  }
};
