import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export function getUserId() {
  const token = cookies().get("token")?.value;
  if (!token) throw new Error("Unauthorized");

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded.id;
}
