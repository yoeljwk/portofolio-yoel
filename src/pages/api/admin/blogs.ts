import { NextApiRequest, NextApiResponse } from "next";
import { verifySession } from "@/lib/adminAuth";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, orderBy } from "firebase/firestore";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Validate session
  const isValid = await verifySession(req);
  if (!isValid) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const blogsCollection = collection(db, "blogs");

  try {
    if (req.method === "GET") {
      const q = query(blogsCollection, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const blogs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return res.status(200).json(blogs);
    } 
    
    if (req.method === "POST") {
      const { title, slug, category, excerpt, content, thumbnail, read_time, published_at, status } = req.body;
      
      const newDoc = await addDoc(blogsCollection, {
        title: title || "",
        slug: slug || "",
        category: category || "",
        excerpt: excerpt || "",
        content: content || "",
        thumbnail: thumbnail || "",
        read_time: read_time || "",
        published_at: published_at || new Date().toISOString().split("T")[0],
        status: status || "draft",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      return res.status(201).json({ id: newDoc.id, success: true });
    }

    if (req.method === "PUT") {
      const { id, title, slug, category, excerpt, content, thumbnail, read_time, published_at, status } = req.body;
      if (!id) return res.status(400).json({ error: "Missing document ID" });

      const docRef = doc(db, "blogs", id);
      await updateDoc(docRef, {
        title,
        slug,
        category,
        excerpt,
        content,
        thumbnail,
        read_time,
        published_at,
        status,
        updatedAt: new Date().toISOString()
      });

      return res.status(200).json({ success: true });
    }

    if (req.method === "DELETE") {
      const { id } = req.query;
      if (!id || typeof id !== "string") return res.status(400).json({ error: "Missing document ID" });

      const docRef = doc(db, "blogs", id);
      await deleteDoc(docRef);

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error: any) {
    console.error("Blogs API error:", error);
    return res.status(500).json({ error: error.message || "Failed to process request" });
  }
}
