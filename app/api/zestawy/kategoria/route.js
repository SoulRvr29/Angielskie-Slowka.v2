import connectDB from "@/config/database";
import WordSets from "@/models/WordSets";

// POST /api/zestawy/kategoria
export const POST = async (request) => {
  try {
    await connectDB();

    console.log("Connected to MongoDB");

    const body = await request.json();
    const newCategory = new WordSets(body);

    await newCategory.save();
    console.log("Saved new category");

    return new Response(JSON.stringify(newCategory), { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/zestawy/kategoria:", error);
    return new Response("Something went wrong", { status: 500 });
  }
};
// DELETE /api/zestawy/kategoria
export const DELETE = async (request) => {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    const { name } = await request.json();

    await WordSets.deleteOne({ category: name });
    console.log(`Deleted category: ${name}`);

    return new Response(JSON.stringify({ category: name }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error in POST /api/zestawy/kategoria:", error);
    return new Response("Something went wrong", { status: 500 });
  }
};
// PUT /api/zestawy/kategoria
export const PUT = async (request) => {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    const { category, newName } = await request.json();
    await WordSets.updateOne(
      { category: category },
      { $set: { category: newName } }
    );
    console.log(`Changed category: ${category} to: ${newName}`);

    return new Response(JSON.stringify({ category: newName }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error in POST /api/zestawy/kategoria:", error);
    return new Response("Something went wrong", { status: 500 });
  }
};
