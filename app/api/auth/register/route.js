import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await dbConnect();

    const { name, email, phone, password } = await req.json();

    if (!name || !email || !phone || !password) {
      return Response.json({ error: "All fields required" }, { status: 400 });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return Response.json({ error: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      phone, // ✅ SAVED
      password: hashedPassword
    });

    return Response.json({ success: true });

  } catch (err) {
    console.error(err);
    return Response.json({ error: "Registration failed" }, { status: 500 });
  }
}
