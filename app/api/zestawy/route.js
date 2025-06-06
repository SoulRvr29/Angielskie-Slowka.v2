import connectDB from "@/config/database";
import WordSets from "@/models/WordSets";

// GET /api/zestawy
export const GET = async (request) => {
  try {
    await connectDB();

    console.log("Connected to MongoDB");

    const zestawy = await WordSets.find({}).sort({ order: 1 });
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
    const { category, name, words } = body;
    console.log(category, name, words);
    // const newWordSet = new WordSets(body);

    await WordSets.updateOne(
      { category: category },
      { $push: { sets: { $each: [{ name, words }] } } }
    );
    // await newWordSet.save();
    console.log("Saved new word set");

    return new Response(JSON.stringify(body), { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/zestawy:", error);
    return new Response("Something went wrong", { status: 500 });
  }
};
