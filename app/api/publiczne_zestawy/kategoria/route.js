import connectDB from "@/config/database";
import User from "@/models/User";

// POST /api/publiczne_zestawy/kategoria
export const POST = async (request) => {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    const { category } = await request.json();

    const newCategory = await User.updateOne(
      { email: process.env.NEXT_PUBLIC_ADMIN_EMAIL },
      { $push: { wordSets: { category: category, words: [] } } }
    );

    console.log("Added new category to wordSets");

    return new Response(JSON.stringify(newCategory), { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/publiczne_zestawy/kategoria:", error);
    return new Response("Something went wrong", { status: 500 });
  }
};
// DELETE /api/publiczne_zestawy/kategoria
export const DELETE = async (request) => {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    const { category } = await request.json();

    await User.updateOne(
      { email: process.env.NEXT_PUBLIC_ADMIN_EMAIL },
      { $pull: { wordSets: { category: category } } }
    );
    console.log(`Deleted category: ${category} from user wordSets`);

    return new Response(JSON.stringify({ category: category }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error in DELETE /api/publiczne_zestawy/kategoria:", error);
    return new Response("Something went wrong", { status: 500 });
  }
};

// PUT /api/publiczne_zestawy/kategoria
export const PUT = async (request) => {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    const { category, newName } = await request.json();
    console.log(category, newName);

    await User.updateOne(
      {
        email: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
        "wordSets.category": category,
      },
      { $set: { "wordSets.$.category": newName } }
    );
    console.log(`Changed category: ${category} to: ${newName}`);

    return new Response(JSON.stringify({ category: newName }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error in PUT /api/publiczne_zestawy/kategoria:", error);
    return new Response("Something went wrong", { status: 500 });
  }
};
