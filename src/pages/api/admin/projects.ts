import { NextApiRequest, NextApiResponse } from "next";
import { verifySession } from "@/lib/adminAuth";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, orderBy } from "firebase/firestore";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const isValid = await verifySession(req);
  if (!isValid) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const projectsCollection = collection(db, "projects");

  try {
    if (req.method === "GET") {
      const q = query(projectsCollection, orderBy("display_order", "asc"));
      const snapshot = await getDocs(q);
      const projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return res.status(200).json(projects);
    }

    if (req.method === "POST") {
      const { title, description, thumbnail, tech_stack, github_url, demo_url, featured, display_order } = req.body;
      
      const newDoc = await addDoc(projectsCollection, {
        title: title || "",
        description: description || "",
        thumbnail: thumbnail || "",
        tech_stack: tech_stack || "",
        github_url: github_url || "",
        demo_url: demo_url || "",
        featured: featured || false,
        display_order: typeof display_order === "number" ? display_order : 999,
        createdAt: new Date().toISOString()
      });

      return res.status(201).json({ id: newDoc.id, success: true });
    }

    if (req.method === "PUT") {
      const { action, reorderList } = req.body;

      if (action === "reorder" && Array.isArray(reorderList)) {
        // Bulk update display order
        for (const item of reorderList) {
          const { id, display_order } = item;
          if (id && typeof display_order === "number") {
            const docRef = doc(db, "projects", id);
            await updateDoc(docRef, { display_order });
          }
        }
        return res.status(200).json({ success: true });
      }

      // Normal single edit
      const { id, title, description, thumbnail, tech_stack, github_url, demo_url, featured, display_order } = req.body;
      if (!id) return res.status(400).json({ error: "Missing document ID" });

      const docRef = doc(db, "projects", id);
      await updateDoc(docRef, {
        title,
        description,
        thumbnail,
        tech_stack,
        github_url,
        demo_url,
        featured,
        display_order: typeof display_order === "number" ? display_order : 999
      });

      return res.status(200).json({ success: true });
    }

    if (req.method === "DELETE") {
      const { id } = req.query;
      if (!id || typeof id !== "string") return res.status(400).json({ error: "Missing document ID" });

      const docRef = doc(db, "projects", id);
      await deleteDoc(docRef);

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error: any) {
    console.error("Projects API error:", error);
    return res.status(500).json({ error: error.message || "Failed to process request" });
  }
}
