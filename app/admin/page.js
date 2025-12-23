import Link from "next/link";

export default function AdminHome() {
  return (
    <div style={{ padding: 40 }}>
      <h1>Admin Dashboard</h1>

      <ul style={{ marginTop: 20 }}>
        <li><Link href="/admin/orders">Orders</Link></li>
        <li><Link href="/admin/users">Users</Link></li>
        <li><Link href="/admin/payments">Payments</Link></li>
        <li><Link href="/admin/menu">Menu</Link></li>
        <li><Link href="/admin/addons">Addons</Link></li>
        <li><Link href="/admin/complaints">Complaints</Link></li>
      </ul>
    </div>
  );
}
