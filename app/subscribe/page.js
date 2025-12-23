export default function SubscribePage() {
  return (
    <div className="subscribe-page light-section">
      <h1>Choose Your Meal Plan</h1>
      <p>
        Pure vegetarian, hygienic, home-style meals prepared with best
        quality ingredients.
      </p>

      <div className="card">
        <h3>Daily Meal</h3>
        <p className="price">₹59 / meal</p>
        <button className="btn-orange">Order Today</button>
      </div>

      <div className="card popular">
        <span className="badge-popular">POPULAR</span>
        <h3>1 Month Plan</h3>
        <p className="price">₹3099</p>
        <p className="save">Save ₹500+</p>
        <button className="btn-green">Subscribe Now</button>
      </div>

      <div className="card best">
        <span className="badge-best">BEST VALUE</span>
        <h3>2 Month Plan</h3>
        <p className="price">₹5999</p>
        <p className="save">Save ₹1200+</p>
        <button className="btn-green">Subscribe Now</button>
      </div>
    </div>
  );
}
