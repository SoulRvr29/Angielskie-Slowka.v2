import connectDB from "@/config/database";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";

// GET /api/znane_slowka/:email
export const GET = async (request, { params }) => {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    // Get the session to identify the logged-in user
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    const wordsToLearn = await User.findOne(
      { email: session.user.email },
      {
        wordsKnown: 1, // Fetch only the matching set
      }
    );

    if (!wordsToLearn) return new Response("Not found", { status: 404 });

    console.log("Fetched word set");
    return new Response(JSON.stringify(wordsToLearn), { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/znane_slowka/:email", error);
    return new Response("Something went wrong", { status: 500 });
  }
};

// PUT /api/znane_slowka/:email
export const PUT = async (request, { params }) => {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    // Get the session to identify the logged-in user
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return new Response("Unauthorized", { status: 401 });
    }
    const { wordsKnown } = await request.json();
    console.log(wordsKnown);

    if (!wordsKnown || !Array.isArray(wordsKnown)) {
      return new Response("Invalid data", { status: 400 });
    }

    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { wordsKnown },
      { new: true } // Return the updated document
    );

    if (!updatedUser) return new Response("Not found", { status: 404 });

    console.log("Updated wordsKnown");
    return new Response(JSON.stringify(updatedUser), { status: 200 });
  } catch (error) {
    console.error("Error in PUT /api/znane_slowka/:email", error);
    return new Response("Something went wrong", { status: 500 });
  }
};
