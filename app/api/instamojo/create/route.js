import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req) {
  try {
    await dbConnect();

    const { email, amount } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.phone) {
      return Response.json({ error: "Phone number missing" }, { status: 400 });
    }

    const payload = {
      purpose: "SatvikMeals Order",
      amount: amount,
      buyer_name: user.name || "Customer",
      email: user.email,
      phone: user.phone, // ✅ REAL USER PHONE
      redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`,
      send_email: true,
      send_sms: true,
      allow_repeated_payments: false
    };

    const response = await fetch(
      `${process.env.INSTAMOJO_BASE_URL}/payment-requests/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": process.env.INSTAMOJO_API_KEY,
          "X-Auth-Token": process.env.INSTAMOJO_AUTH_TOKEN
        },
        body: JSON.stringify(payload)
      }
    );

    const data = await response.json();

    if (!data.success) {
      console.error("Instamojo Error:", data);
      return Response.json({ error: data.message }, { status: 400 });
    }

    return Response.json({
      paymentUrl: data.payment_request.longurl
    });

  } catch (err) {
    console.error("Instamojo exception:", err);
    return Response.json({ error: "Unable to start payment" }, { status: 500 });
  }
}
