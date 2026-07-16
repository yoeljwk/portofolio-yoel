import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/firebase";
import { doc, deleteDoc } from "firebase/firestore";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = req.cookies.admin_session_token;

  if (token) {
    try {
      // Delete session from Firestore
      await deleteDoc(doc(db, "admin_sessions", token));
    } catch (error) {
      console.error("Error deleting session doc:", error);
    }
  }

  // Clear cookie
  const cookieOptions = [
    "admin_session_token=",
    "Path=/",
    "HttpOnly",
    "Expires=Thu, 01 Jan 1970 00:00:00 GMT",
    "Max-Age=0",
    "SameSite=Strict",
  ].join("; ");

  res.setHeader("Set-Cookie", cookieOptions);
  return res.status(200).json({ success: true });
}
