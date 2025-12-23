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

/* GET → Admin sees menu */
export async function POST(req) {
  try {
    await dbConnect();
    await checkAdmin(req);

    const body = await req.json();

    const menu = await Menu.findOneAndUpdate(
      {}, // only one menu
      {
        title: "Today's Menu",
        items: body.items,
        published: true   // ✅ THIS WAS MISSING
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
