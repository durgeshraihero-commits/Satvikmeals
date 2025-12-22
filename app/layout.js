import './globals.css';

export const metadata = {
  title: 'SatvikMeals',
  description: 'Pure Veg • Student Friendly • Monthly Meals',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="navbar">
          <div className="logo">
            🌿 SatvikMeals
          </div>
          <nav className="nav-links">
            <a href="/">Home</a>
            <a href="/menu">Menu</a>
            <a href="/subscribe">Subscribe</a>
            <a href="/login" className="login-btn">Login</a>
          </nav>
        </header>

        <main className="container">
          {children}
        </main>
      </body>
    </html>
  );
}
