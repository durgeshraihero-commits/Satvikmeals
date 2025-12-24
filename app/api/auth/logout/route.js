import { NextResponse } from "next/server";

export async function GET() {
  const res = NextResponse.redirect(new URL("/login", process.env.BASE_URL));
  res.cookies.set("token", "", { maxAge: 0 });
  return res;
}
