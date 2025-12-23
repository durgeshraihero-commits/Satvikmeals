import dbConnect from "../../../../lib/mongodb";
import User from "../../../../models/User";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    await dbConnect();
    const { identifier, password } = await req.json();

    if (!identifier || !password) {
      return Response.json({ error: "All fields required" }, { status: 400 });
    }

    const user = await User.findOne({
      $or: [{ phone: identifier }, { email: identifier }],
    });

    if (!user || user.password !== password) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // ✅ CREATE JWT WITH ROLE
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role || "user",
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ SAVE TOKEN IN COOKIE
    cookies().set("token", token, {
      httpOnly: true,
      secure: false, // true in production
      path: "/",
    });

    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: "Login failed" }, { status: 500 });
  }
}
