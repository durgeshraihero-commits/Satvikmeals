import dbConnect from "../../../../lib/mongodb";
import Menu from "../../../../models/Menu";
import User from "../../../../models/User";

/* ADMIN CHECK */
async function checkAdmin(req) {
  const email = req.headers.get("x-user-email");
  if (!email) throw new Error("Unauthorized");

  const admin = await User.findOne({ email });
  if (!admin || admin.role !== "admin") {
    throw new Error("Forbidden");
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    await checkAdmin(req);

    const body = await req.json();

    // 🔒 FORCE items to be array
    const items = Array.isArray(body.items)
      ? body.items
      : [body];

    const menu = await Menu.findOneAndUpdate(
      {},
      {
        title: "Today's Menu",
        items,
        published: true
      },
      { upsert: true, new: true }
    );

    return Response.json(menu);
  } catch (err) {
    return Response.json(
      { error: err.message },
      { status: 401 }
    );
  }
}
