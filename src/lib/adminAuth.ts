import { db } from "./firebase";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { NextApiRequest } from "next";

export async function verifySession(req: NextApiRequest): Promise<boolean> {
  const token = req.cookies.admin_session_token;
  if (!token) return false;

  try {
    const sessionDocRef = doc(db, "admin_sessions", token);
    const sessionDoc = await getDoc(sessionDocRef);

    if (!sessionDoc.exists()) {
      return false;
    }

    const sessionData = sessionDoc.data();
    const expiresAt = sessionData.expiresAt?.toDate ? sessionData.expiresAt.toDate() : new Date(sessionData.expiresAt);
    
    if (new Date() > expiresAt) {
      // Session has expired, remove it from DB
      await deleteDoc(sessionDocRef);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in verifySession:", error);
    return false;
  }
}
