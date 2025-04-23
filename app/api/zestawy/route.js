import connectDB from "@/config/database";
import WordSets from "@/models/WordSets";

// GET /api/zestawy
export const GET = async (request) => {
  try {
    await connectDB();

    console.log("Connected to MongoDB");

    const zestawy = await WordSets.find({});
    console.log("Fetched word sets");

    return new Response(JSON.stringify(zestawy), { status: 200 });
  } catch (error) {
    console.error("Error in /api/zestawy:", error);
    return new Response("Something went wrong", { status: 500 });
  }
};

// POST /api/zestawy
export const POST = async (request) => {
  try {
    await connectDB();

    console.log("Connected to MongoDB");

    const body = await request.json();
    const newWordSet = new WordSets(body);

    await newWordSet.save();
    console.log("Saved new word set");

    return new Response(JSON.stringify(newWordSet), { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/zestawy:", error);
    return new Response("Something went wrong", { status: 500 });
  }
};

// PUT /api/zestawy
export const PUT = async (request) => {
  try {
    await connectDB();

    console.log("Connected to MongoDB");

    const body = await request.json();
    const { id, updateData } = body;

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
