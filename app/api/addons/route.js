import dbConnect from "@/lib/mongodb";
import AddOn from "@/models/AddOn";

export async function GET() {
  await dbConnect();
  return Response.json(await AddOn.find({ available: true }));
}
