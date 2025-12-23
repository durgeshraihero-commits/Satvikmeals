"use client";

import { useEffect, useState } from "react";

export default function CartPage() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    loadCart();
  }, []);

  async function loadCart() {
    try {
      const res = await fetch("/api/cart");
      const data = await res.json();
      setCart(data);
    } catch (err) {
      alert("Failed to load cart");
    } finally {
      setLoading(false);
    }
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

  // 🔥 INSTAMOJO CHECKOUT
  async function proceedToInstamojo() {
    setPaying(true);

    try {
      const res = await fetch("/api/instamojo/create-payment", {
        method: "POST"
      });

      const data = await res.json();

      if (data.error || !data.url) {
        alert(data.error || "Payment failed");
        setPaying(false);
        return;
      }

      // 🚀 Redirect user to Instamojo
      window.location.href = data.url;
    } catch (err) {
      alert("Unable to start payment");
      setPaying(false);
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
      <h2 style={{ marginBottom: 12 }}>🛒 Your Cart</h2>

      {cart.items.map(item => (
        <div
          key={item.itemId}
          style={{
            display: "flex",
            gap: 12,
            padding: 12,
            background: "#ffffff",
            borderRadius: 12,
            marginBottom: 10,
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
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
            <p style={{ margin: "4px 0" }}>
              ₹{item.price} × {item.quantity}
            </p>

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
          background: paying ? "#94a3b8" : "#2563eb",
          color: "#fff",
          borderRadius: 12,
          border: "none",
          fontSize: 16,
          cursor: paying ? "not-allowed" : "pointer"
        }}
        onClick={proceedToInstamojo}
        disabled={paying}
      >
        {paying ? "Redirecting to payment..." : "Pay Online (Instamojo) 💳"}
      </button>
    </div>
  );
}
