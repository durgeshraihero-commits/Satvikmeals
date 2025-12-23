import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/mongodb";
import Cart from "../../../../models/Cart";

export async function POST(req) {
  try {
    await dbConnect();

    const { email, phone } = await req.json();

    const cart = await Cart.findOne();
    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    const amount = cart.items.reduce(
      (sum, i) => sum + Number(i.price) * i.quantity,
      0
    );

    const payload = new URLSearchParams({
      purpose: "SatvikMeals Order",
      amount: amount.toString(),
      buyer_name: email,
      email: email,
      phone: phone,
      redirect_url: `${process.env.SITE_URL}/payment/success`,
      webhook: `${process.env.SITE_URL}/api/instamojo/webhook`,
      allow_repeated_payments: "false"
    });

    const response = await fetch(
      `${process.env.INSTAMOJO_BASE_URL}/v2/payment_requests/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "X-Api-Key": process.env.INSTAMOJO_API_KEY,
          "X-Auth-Token": process.env.INSTAMOJO_AUTH_TOKEN
        },
        body: payload.toString()
      }
    );

    const text = await response.text();

    if (!response.ok) {
      console.error("Instamojo error:", text);
      return NextResponse.json(
        { error: "Unable to start payment" },
        { status: 500 }
      );
    }

    const data = JSON.parse(text);

    return NextResponse.json({
      paymentUrl: data.longurl
    });

  } catch (err) {
    console.error("Instamojo exception:", err);
    return NextResponse.json(
      { error: "Payment failed" },
      { status: 500 }
    );
  }
}
