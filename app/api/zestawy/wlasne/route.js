import connectDB from "@/config/database";
import UserSets from "@/models/UserSets";

// GET /api/zestawy
export const GET = async (request) => {
  try {
    await connectDB();

    console.log("Connected to MongoDB");

    const zestawy = await UserSets.find();
    console.log("Fetched word sets");

    return new Response(JSON.stringify(zestawy), { status: 200 });
  } catch (error) {
    console.error("Error in /api/zestawy:", error);
    return new Response("Something went wrong", { status: 500 });
  }
};
