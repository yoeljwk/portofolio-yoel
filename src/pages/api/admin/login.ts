import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import crypto from "crypto";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { accessCode } = req.body;
  const correctAccessCode = process.env.ADMIN_ACCESS_CODE;

  if (!correctAccessCode) {
    return res.status(500).json({ error: "Admin access code is not configured on server" });
  }

  if (accessCode !== correctAccessCode) {
    return res.status(401).json({ error: "Invalid access code" });
  }

  try {
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Store session in Firestore
    await setDoc(doc(db, "admin_sessions", token), {
      expiresAt: expiresAt,
      createdAt: new Date(),
    });

    // Set cookie
    const isProd = process.env.NODE_ENV === "production";
    const cookieOptions = [
      `admin_session_token=${token}`,
      "Path=/",
      "HttpOnly",
      isProd ? "Secure" : "",
      "SameSite=Strict",
      `Max-Age=${7 * 24 * 60 * 60}`, // 7 days in seconds
    ].filter(Boolean).join("; ");

    res.setHeader("Set-Cookie", cookieOptions);
    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error("Error creating session:", error);
    return res.status(500).json({ error: error.message || "Failed to create session" });
  }
}
