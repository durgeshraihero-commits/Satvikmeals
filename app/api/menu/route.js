import dbConnect from "../../../lib/mongodb";
import Menu from "../../../models/Menu";

export async function GET() {
  try {
    await dbConnect();

    const menu = await Menu.findOne({ published: true });

    if (!menu) {
      return Response.json({ items: [] });
    }

    return Response.json(menu);
  } catch {
    return Response.json(
      { error: "Failed to load menu" },
      { status: 500 }
    );
  }
}
