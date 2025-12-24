import dbConnect from "@/lib/mongodb";
import Addon from "@/models/Addon";

export async function GET() {
  await dbConnect();
  return Response.json(await Addon.find({ available: true }));
}
