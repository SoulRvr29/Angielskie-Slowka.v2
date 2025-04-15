import connectDB from "@/config/database";
import WordSets from "@/models/WordSets";

// GET /api/zestawy
export const GET = async (request) => {
  try {
    await connectDB();

    const zestawy = await WordSets.find();

    return new Response(JSON.stringify(zestawy), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Something went wrong", { status: 500 });
  }
};
