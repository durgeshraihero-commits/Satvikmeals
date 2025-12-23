import dbConnect from "../../../../lib/mongodb";
import Addon from "../../../../models/Addon";
import User from "../../../../models/User";

async function checkAdmin(req) {
  const email = req.headers.get("x-user-email");
  const admin = await User.findOne({ email });
  if (!admin || admin.role !== "admin") {
    throw new Error("Forbidden");
  }
}

export async function GET() {
  await dbConnect();
  return Response.json(await Addon.find());
}

export async function POST(req) {
  await dbConnect();
  await checkAdmin(req);

  const body = await req.json();
  const addon = await Addon.create(body);
  return Response.json(addon);
}
