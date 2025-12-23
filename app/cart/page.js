"use client";

import { useEffect, useState } from "react";

export default function CartPage() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  async function loadCart() {
    const res = await fetch("/api/cart");
    const data = await res.json();
    setCart(data);
    setLoading(false);
  }

  async function updateQty(itemId, action) {
    const res = await fetch("/api/cart", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId, action })
    });
    const data = await res.json();
    setCart(data);
  }

  async function proceedToInstamojo() {
    const res = await fetch("/api/instamojo/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "durgeshrai214@gmail.com",   // TEMP
        phone: "9999999999",                // TEMP
        amount: cart.items.reduce(
          (sum, i) => sum + Number(i.price) * i.quantity,
          0
        ),
        items: cart.items
      })
    });

    const data = await res.json();

    if (data.error) {
      alert(data.error);
      return;
    }

    // 🚀 Redirect to Instamojo
    window.location.href = data.paymentUrl;
  }

  if (loading) {
    return <p style={{ padding: 20 }}>Loading cart...</p>;
  }

  if (!cart || cart.items.length === 0) {
    return <h2 style={{ padding: 20 }}>🛒 Your cart is empty</h2>;
  }

  const total = cart.items.reduce(
    (sum, i) => sum + Number(i.price) * i.quantity,
    0
  );

  return (
    <div style={{ maxWidth: 420, margin: "auto", padding: 16 }}>
      <h2>🛒 Your Cart</h2>

      {cart.items.map(item => (
        <div
          key={item.itemId}
          style={{
            display: "flex",
            gap: 12,
            padding: 12,
            background: "#fff",
            borderRadius: 12,
            marginBottom: 10
          }}
        >
          <div style={{ flex: 1 }}>
            <strong>{item.name}</strong>
            <p>₹{item.price} × {item.quantity}</p>

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => updateQty(item.itemId, "dec")}>−</button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQty(item.itemId, "inc")}>+</button>
            </div>
          </div>
        </div>
      ))}

      <h3>Total: ₹{total}</h3>

      <button
        style={{
          width: "100%",
          marginTop: 12,
          padding: 12,
          background: "#22c55e",
          color: "#fff",
          borderRadius: 10,
          border: "none",
          fontSize: 16
        }}
        onClick={proceedToInstamojo}
      >
        Pay Online (Instamojo) 💳
      </button>
    </div>
  );
}
