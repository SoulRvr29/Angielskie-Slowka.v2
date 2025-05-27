import connectDB from "@/config/database";
import WordSets from "@/models/WordSets";

// GET /api/losowy
export const GET = async (request, { params }) => {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    const allWordSets = await WordSets.find();

    if (!allWordSets) return new Response("Not found", { status: 404 });

    console.log("Fetched word sets");
    return new Response(JSON.stringify(allWordSets), { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/losowy", error);
    return new Response("Something went wrong", { status: 500 });
  }
};
