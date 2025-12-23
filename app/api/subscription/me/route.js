import dbConnect from "../../../../lib/mongodb";
import Subscription from "@/models/Subscription";
import { getUserId } from "@/lib/auth";

export async function GET() {
  await dbConnect();
  const userId = getUserId();

  const sub = await Subscription.findOne({ userId });
  return Response.json(sub || {});
}
