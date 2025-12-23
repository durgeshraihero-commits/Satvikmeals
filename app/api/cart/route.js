import dbConnect from "../../../lib/mongodb";
import Cart from "../../../models/Cart";

/* ================= GET CART ================= */
export async function GET() {
  await dbConnect();
  const cart = await Cart.findOne() || { items: [] };
  return Response.json(cart);
}

/* ================= ADD TO CART ================= */
export async function POST(req) {
  await dbConnect();
  const body = await req.json();

  let cart = await Cart.findOne();
  if (!cart) cart = await Cart.create({ items: [] });

  const existing = cart.items.find(
    i => i.itemId?.toString() === body.itemId
  );

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.items.push({
      itemId: body.itemId,
      name: body.name,
      price: Number(body.price),     // ✅ force number
      image: body.image || "",
      quantity: 1
    });
  }

  await cart.save();
  return Response.json(cart);
}

/* ================= UPDATE QUANTITY (+ / −) ================= */
export async function PATCH(req) {
  await dbConnect();
  const { itemId, action } = await req.json();

  const cart = await Cart.findOne();
  if (!cart) return Response.json({ items: [] });

  const item = cart.items.find(
    i => i.itemId.toString() === itemId
  );

  if (!item) return Response.json(cart);

  if (action === "inc") item.quantity += 1;
  if (action === "dec") item.quantity -= 1;

  // remove item if quantity becomes 0
  cart.items = cart.items.filter(i => i.quantity > 0);

  await cart.save();
  return Response.json(cart);
}

/* ================= CLEAR CART (AFTER CHECKOUT) ================= */
export async function DELETE() {
  await dbConnect();
  const cart = await Cart.findOne();
  if (cart) {
    cart.items = [];
    await cart.save();
  }
  return Response.json({ success: true });
}
