import connectDB from "@/config/database";
import WordSets from "@/models/WordSets";

// GET /api/zestawy/:id
export const GET = async (request, { params }) => {
  try {
    await connectDB();

    console.log("Connected to MongoDB");

    const zestaw = await WordSets.findOne(
      { "sets._id": params.id },
      { sets: { $elemMatch: { _id: params.id } } }
    );
    console.log(`TEST_____ ${zestaw}`);

    if (!zestaw) return new Response("Not found", { status: 404 });

    console.log("Fetched word set");
    return new Response(JSON.stringify(zestaw), { status: 200 });
  } catch (error) {
    console.error("Error in /api/:id", error);
    return new Response("Something went wrong", { status: 500 });
  }
};

// DELETE /api/zestawy/:id
export const DELETE = async (request, { params }) => {
  try {
    await connectDB();

    console.log("Connected to MongoDB");

    const deletedZestaw = await WordSets.updateOne(
      { "sets._id": params.id },
      { $pull: { sets: { _id: params.id } } }
    );

    if (!deletedZestaw) return new Response("Not found", { status: 404 });

    console.log("Deleted word set");
    return new Response("Deleted successfully", { status: 200 });
  } catch (error) {
    console.error("Error in DELETE /api/:id", error);
    return new Response("Something went wrong", { status: 500 });
  }
};
