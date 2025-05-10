import connectDB from "@/config/database";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";

// POST /api/prywatne_zestawy/kategoria
export const POST = async (request) => {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    // Get the session to identify the logged-in user
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { category } = await request.json();

    const newCategory = await User.updateOne(
      { _id: session.user.id },
      { $push: { wordSets: { category: category, words: [] } } }
    );

    console.log("Added new category:", category);

    return new Response(JSON.stringify(newCategory), { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/prywatne_zestawy/kategoria:", error);
    return new Response("Something went wrong", { status: 500 });
  }
};

// DELETE /api/prywatne_zestawy/kategoria
export const DELETE = async (request) => {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    // Get the session to identify the logged-in user
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { category } = await request.json();

    await User.updateOne(
      { _id: session.user.id },
      { $pull: { wordSets: { category: category } } }
    );
    console.log(`Deleted category: ${category}`);

    return new Response(JSON.stringify({ category: category }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error in DELETE /api/zestawy/kategoria:", error);
    return new Response("Something went wrong", { status: 500 });
  }
};

// PUT /api/prywatne_zestawy/kategoria
export const PUT = async (request) => {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    // Get the session to identify the logged-in user
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { category, newName } = await request.json();

    await User.updateOne(
      { _id: session.user.id, "wordSets.category": category },
      { $set: { "wordSets.$.category": newName } }
    );
    console.log(`Changed category: ${category} to: ${newName}`);

    return new Response(JSON.stringify({ category: newName }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error in PUT /api/prywatne_zestawy/kategoria:", error);
    return new Response("Something went wrong", { status: 500 });
  }
};
