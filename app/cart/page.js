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

  async function payWithInstamojo() {
    try {
      const total = cart.items.reduce(
        (sum, i) => sum + Number(i.price) * i.quantity,
        0
      );

      const res = await fetch("/api/instamojo/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "durgeshrai214@gmail.com",   // TEMP (replace later with auth)
          phone: "9999999999",                // TEMP
          amount: total
        })
      });

      const data = await res.json();

      if (data.error) {
        alert("Unable to start payment");
        return;
      }

      // 🚀 Redirect user to Instamojo
      window.location.href = data.paymentUrl;

    } catch (err) {
      alert("Payment failed");
    }
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
      <h2 style={{ marginBottom: 16 }}>🛒 Your Cart</h2>

      {cart.items.map(item => (
        <div
          key={item.itemId}
          style={{
            display: "flex",
            gap: 12,
            padding: 12,
            background: "#fff",
            borderRadius: 12,
            marginBottom: 10,
            alignItems: "center"
          }}
        >
          {item.image && (
            <img
              src={item.image}
              alt={item.name}
              style={{
                width: 70,
                height: 70,
                borderRadius: 8,
                objectFit: "cover"
              }}
            />
          )}

          <div style={{ flex: 1 }}>
            <strong>{item.name}</strong>
            <p>₹{item.price}</p>

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => updateQty(item.itemId, "dec")}>−</button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQty(item.itemId, "inc")}>+</button>
            </div>
          </div>
        </div>
      ))}

      <h3 style={{ marginTop: 12 }}>Total: ₹{total}</h3>

      <button
        style={{
          width: "100%",
          marginTop: 14,
          padding: 14,
          background: "#22c55e",
          color: "#fff",
          borderRadius: 10,
          border: "none",
          fontSize: 16
        }}
        onClick={payWithInstamojo}
      >
        Pay Online (Instamojo) 💳
      </button>
    </div>
  );
}
