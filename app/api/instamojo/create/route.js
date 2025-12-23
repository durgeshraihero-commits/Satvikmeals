import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { amount, email, phone } = await req.json();

    const response = await fetch(
      `${process.env.INSTAMOJO_BASE_URL}payment-requests/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "X-Api-Key": process.env.INSTAMOJO_API_KEY,
          "X-Auth-Token": process.env.INSTAMOJO_AUTH_TOKEN
        },
        body: new URLSearchParams({
          purpose: "SatvikMeals Order",
          amount: amount.toString(),
          buyer_name: "Customer",
          email,
          phone,
          redirect_url: "https://satvikmeals.onrender.com/payment/success",
          webhook: "https://satvikmeals.onrender.com/api/instamojo/webhook",
          send_email: "true",
          send_sms: "true",
          allow_repeated_payments: "false"
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Instamojo error:", data);
      return NextResponse.json({ error: data }, { status: 400 });
    }

    return NextResponse.json({
      paymentUrl: data.payment_request.longurl
    });

  } catch (err) {
    console.error("Instamojo exception:", err);
    return NextResponse.json(
      { error: "Unable to start payment" },
      { status: 500 }
    );
  }
}
