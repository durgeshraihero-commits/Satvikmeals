import dbConnect from "@/lib/mongodb";
import Cart from "@/models/Cart";

export async function POST() {
  await dbConnect();

  const cart = await Cart.findOne();
  if (!cart || cart.items.length === 0) {
    return Response.json({ error: "Cart empty" }, { status: 400 });
  }

  const amount = cart.items.reduce(
    (s, i) => s + i.price * i.quantity,
    0
  );

  const payload = {
    amount,
    purpose: "SatvikMeals Order",
    buyer_name: "Customer",
    email: "customer@satvikmeals.com",
    redirect_url: process.env.INSTAMOJO_REDIRECT_URL,
    send_email: false,
    allow_repeated_payments: false
  };

  const res = await fetch(
    `${process.env.INSTAMOJO_BASE_URL}payment_requests/`,
    {
      method: "POST",
      headers: {
        "X-Api-Key": process.env.INSTAMOJO_API_KEY,
        "X-Auth-Token": process.env.INSTAMOJO_AUTH_TOKEN,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    }
  );

  const data = await res.json();
  return Response.json({ url: data.payment_request.longurl });
}
