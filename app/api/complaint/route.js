import dbConnect from "@/lib/mongodb";
import Complaint from "@/models/Complaint";
import { getUserId } from "@/lib/auth";

export async function POST(req) {
  await dbConnect();
  const userId = getUserId();
  const { message } = await req.json();

  await Complaint.create({ userId, message });
  return Response.json({ success: true });
}
