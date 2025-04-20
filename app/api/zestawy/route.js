import connectDB from "@/config/database";
import WordSets from "@/models/WordSets";

// GET /api/zestawy
export const GET = async (request) => {
  try {
    await connectDB();

    console.log("Connected to MongoDB");

    const zestawy = await WordSets.find();
    console.log("Fetched word sets");

    return new Response(JSON.stringify(zestawy), { status: 200 });
  } catch (error) {
    console.error("Error in /api/zestawy:", error);
    return new Response("Something went wrong", { status: 500 });
  }
};
