import connectDB from "@/config/database";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";

// GET /api/zestawy/wlasne
export const GET = async (request) => {
  try {
    await connectDB();

    console.log("Connected to MongoDB");
    console.log("test dfh dsfhifudsufdshuifh");

    // Get the session to identify the logged-in user
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Fetch word sets for the logged-in user
    const zestawy = await User.find({ userId: session.user.id });

    console.log("Fetched word sets for user:", session.user.email);

    return new Response(JSON.stringify(zestawy), { status: 200 });
  } catch (error) {
    console.error("Error in /api/zestawy/wlasne:", error);
    return new Response("Something went wrong", { status: 500 });
  }
};
