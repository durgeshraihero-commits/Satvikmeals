export async function POST(req) {
  try {
    const body = await req.json();

    const response = await fetch(
      "https://www.instamojo.com/api/1.1/payment-requests/",
      {
        method: "POST",
        headers: {
          "X-Api-Key": process.env.INSTAMOJO_API_KEY,
          "X-Auth-Token": process.env.INSTAMOJO_AUTH_TOKEN,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          purpose: "SatvikMeals Order",
          amount: body.amount.toString(),
          buyer_name: "SatvikMeals Customer",
          email: body.email,
          phone: body.phone,
          redirect_url: `${process.env.BASE_URL}/payment/success`,
          send_email: "true",
          send_sms: "true",
          allow_repeated_payments: "false"
        })
      }
    );

    const data = await response.json();

    if (!data.success) {
      return Response.json({ error: "Instamojo failed" }, { status: 400 });
    }

    return Response.json({
      paymentUrl: data.payment_request.longurl
    });

  } catch (err) {
    return Response.json(
      { error: "Payment creation error" },
      { status: 500 }
    );
  }
}
