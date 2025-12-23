import dbConnect from "../../../../lib/mongodb";
import User from "../../../../models/User";
import { generateReferralCode } from "../../../../lib/referral";

export async function POST(req) {
  try {
    await dbConnect();

    const {
      name,
      phone,
      email,
      password,
      referredBy, // optional referral code
    } = await req.json();

    // ✅ Validation
    if (!name || !phone || !email || !password) {
      return Response.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // ✅ Check existing user
    const exists = await User.findOne({
      $or: [{ phone }, { email }],
    });

    if (exists) {
      return Response.json(
        { error: "Phone or Email already registered" },
        { status: 400 }
      );
    }

    // ✅ Generate unique referral code for new user
    const referralCode = generateReferralCode(name);

    // ✅ Create user
    await User.create({
      name,
      phone,
      email,
      password, // not hashed (as per your request)
      referralCode,
      referredBy: referredBy || null,
      walletBalance: 0,
    });

    return Response.json({ success: true });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return Response.json(
      { error: "Registration failed" },
      { status: 500 }
    );
  }
}
