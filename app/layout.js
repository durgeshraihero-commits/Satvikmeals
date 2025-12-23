import './globals.css';
import Link from "next/link";   // ✅ REQUIRED

export const metadata = {
  title: 'SatvikMeals',
  description: 'Pure Veg • Student Friendly • Monthly Meals',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
<header className="navbar">
  <div className="nav-container">
    <div className="logo">🌿 SatvikMeals</div>

    <nav className="nav-links">
      <Link href="/">Home</Link>
      <Link href="/menu">Menu</Link>
      <Link href="/subscribe">Subscribe</Link>
    </nav>

    <div className="nav-actions">
      <Link href="/cart" className="cart-btn">🛒</Link>
      <Link href="/login" className="login-btn">Login</Link>
    </div>
  </div>
</header>
        <main className="container">
          {children}
        </main>
      </body>
    </html>
  );
}
