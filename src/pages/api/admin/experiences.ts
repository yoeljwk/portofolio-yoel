import { NextApiRequest, NextApiResponse } from "next";
import { verifySession } from "@/lib/adminAuth";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, orderBy } from "firebase/firestore";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const isValid = await verifySession(req);
  if (!isValid) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const experiencesCollection = collection(db, "experiences");

  try {
    if (req.method === "GET") {
      const q = query(experiencesCollection, orderBy("display_order", "asc"));
      const snapshot = await getDocs(q);
      const experiences = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return res.status(200).json(experiences);
    }

    if (req.method === "POST") {
      const { company, position, start_date, end_date, location, description, display_order, thumbnail } = req.body;
      
      const newDoc = await addDoc(experiencesCollection, {
        company: company || "",
        position: position || "",
        start_date: start_date || "",
        end_date: end_date || "",
        location: location || "",
        description: description || "",
        thumbnail: thumbnail || "",
        display_order: typeof display_order === "number" ? display_order : 999,
        createdAt: new Date().toISOString()
      });

      return res.status(201).json({ id: newDoc.id, success: true });
    }

    if (req.method === "PUT") {
      const { action, reorderList } = req.body;

      if (action === "reorder" && Array.isArray(reorderList)) {
        for (const item of reorderList) {
          const { id, display_order } = item;
          if (id && typeof display_order === "number") {
            const docRef = doc(db, "experiences", id);
            await updateDoc(docRef, { display_order });
          }
        }
        return res.status(200).json({ success: true });
      }

      const { id, company, position, start_date, end_date, location, description, display_order, thumbnail } = req.body;
      if (!id) return res.status(400).json({ error: "Missing document ID" });

      const docRef = doc(db, "experiences", id);
      await updateDoc(docRef, {
        company,
        position,
        start_date,
        end_date,
        location,
        description,
        thumbnail,
        display_order: typeof display_order === "number" ? display_order : 999
      });

      return res.status(200).json({ success: true });
    }

    if (req.method === "DELETE") {
      const { id } = req.query;
      if (!id || typeof id !== "string") return res.status(400).json({ error: "Missing document ID" });

      const docRef = doc(db, "experiences", id);
      await deleteDoc(docRef);

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error: any) {
    console.error("Experiences API error:", error);
    return res.status(500).json({ error: error.message || "Failed to process request" });
  }
}
