import connectDB from "@/config/database";
import WordSets from "@/models/WordSets";

// GET /api/zestawy/:id
export const GET = async (request, { params }) => {
  try {
    await connectDB();

    console.log("Connected to MongoDB");

    const zestaw = await WordSets.findById(params.id);

    if (!zestaw) return new Response("Not found", { status: 404 });

    console.log("Fetched word sets");
    return new Response(JSON.stringify(zestaw), { status: 200 });
  } catch (error) {
    console.error("Error in /api/:id", error);
    return new Response("Something went wrong", { status: 500 });
  }
};
