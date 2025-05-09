import connectDB from "@/config/database";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";

// POST /api/zestawy/wlasne/kategoria
export const POST = async (request) => {
  try {
    await connectDB();

    console.log("Connected to MongoDB");

    // Get the session to identify the logged-in user
    const session = await getServerSession(authOptions);

    const { category } = await request.json();

    console.log(session.user.id);
    const newCategory = await User.updateOne(
      { _id: session.user.id },
      { $push: { wordSets: { category: category, words: [] } } }
    );

    console.log("Added new category to wordSets");

    return new Response(JSON.stringify(newCategory), { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/zestawy/kategoria:", error);
    return new Response("Something went wrong", { status: 500 });
  }
};

// DELETE /api/zestawy/wlasne/kategoria
export const DELETE = async (request) => {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    const { category } = await request.json();

    // Get the session to identify the logged-in user
    const session = await getServerSession(authOptions);

    await User.updateOne(
      { _id: session.user.id },
      { $pull: { wordSets: { category: category } } }
    );
    console.log(`Deleted category: ${category} from user wordSets`);

    return new Response(JSON.stringify({ category: category }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error in DELETE /api/zestawy/kategoria:", error);
    return new Response("Something went wrong", { status: 500 });
  }
};

// PUT /api/zestawy/wlasne/kategoria
export const PUT = async (request) => {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    // Get the session to identify the logged-in user
    const session = await getServerSession(authOptions);

    const { category, newName } = await request.json();
    console.log(category, newName);

    await User.updateOne(
      { _id: session.user.id, "wordSets.category": category },
      { $set: { "wordSets.$.category": newName } }
    );
    console.log(`Changed category: ${category} to: ${newName}`);

    return new Response(JSON.stringify({ category: newName }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error in PUT /api/zestawy/kategoria:", error);
    return new Response("Something went wrong", { status: 500 });
  }
};
