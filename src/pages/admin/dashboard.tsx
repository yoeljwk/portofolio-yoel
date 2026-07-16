import Head from "next/head";
import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, BookOpen, Briefcase, Calendar,
  LogOut, Plus, Trash2, Edit3, ArrowUp, ArrowDown,
  Upload, CheckCircle, Database, Eye, X, Globe, GitBranch
} from "lucide-react";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { initializeApp, getApps } from "firebase/app";

// Firebase client config helper for storage uploading
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const getFirebaseApp = () => {
  return getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
};

type Tab = "dashboard" | "blogs" | "projects" | "experiences";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [blogs, setBlogs] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  
  // Seeding state
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<any>(null);

  // Form states
  const [editingItem, setEditingItem] = useState<any | null>(null); // For edit operations
  const [isFormOpen, setIsFormOpen] = useState(false); // Add panel trigger
  const [formLoading, setFormLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);

  // Form Fields
  // Blogs
  const [blogTitle, setBlogTitle] = useState("");
  const [blogSlug, setBlogSlug] = useState("");
  const [blogCategory, setBlogCategory] = useState("");
  const [blogExcerpt, setBlogExcerpt] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [blogThumbnail, setBlogThumbnail] = useState("");
  const [blogReadTime, setBlogReadTime] = useState("");
  const [blogPublishedAt, setBlogPublishedAt] = useState("");
  const [blogStatus, setBlogStatus] = useState("draft");

  // Projects
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectThumbnail, setProjectThumbnail] = useState("");
  const [projectTechStack, setProjectTechStack] = useState("");
  const [projectGithubUrl, setProjectGithubUrl] = useState("");
  const [projectDemoUrl, setProjectDemoUrl] = useState("");
  const [projectFeatured, setProjectFeatured] = useState(false);

  // Experiences
  const [expCompany, setExpCompany] = useState("");
  const [expPosition, setExpPosition] = useState("");
  const [expStartDate, setExpStartDate] = useState("");
  const [expEndDate, setExpEndDate] = useState("");
  const [expLocation, setExpLocation] = useState("");
  const [expDescription, setExpDescription] = useState("");
  const [expThumbnail, setExpThumbnail] = useState("");

  const router = useRouter();

  // Load Data
  const fetchData = async () => {
    setLoadingData(true);
    try {
      const blogsRes = await fetch("/api/admin/blogs");
      const blogsData = await blogsRes.json();
      setBlogs(Array.isArray(blogsData) ? blogsData : []);

      const projectsRes = await fetch("/api/admin/projects");
      const projectsData = await projectsRes.json();
      setProjects(Array.isArray(projectsData) ? projectsData : []);

      const expRes = await fetch("/api/admin/experiences");
      const expData = await expRes.json();
      setExperiences(Array.isArray(expData) ? expData : []);
    } catch (err) {
      console.error("Failed to load CMS data:", err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Sync Slug auto generation
  useEffect(() => {
    if (activeTab === "blogs" && !editingItem) {
      setBlogSlug(blogTitle.toLowerCase().replace(/\s+/g, "-").replace(/[^\w\-]+/g, ""));
    }
  }, [blogTitle]);

  // Logout Handler
  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin");
    } catch (err) {
      console.error("Logout failed:", err);
      setLogoutLoading(false);
    }
  };

  // Seeding Handler
  const handleSeed = async () => {
    setIsSeeding(true);
    setSeedResult(null);
    try {
      const res = await fetch("/api/admin/seed", { method: "POST" });
      const data = await res.json();
      setSeedResult(data);
      fetchData();
    } catch (err) {
      console.error("Seeding failed:", err);
    } finally {
      setIsSeeding(false);
    }
  };

  // Image Upload directly to Firebase Storage
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetFieldSetter: (url: string) => void) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploadLoading(true);

    try {
      const app = getFirebaseApp();
      const storage = getStorage(app);
      const fileRef = storageRef(storage, `uploads/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(fileRef, file);
      const downloadUrl = await getDownloadURL(snapshot.ref);
      targetFieldSetter(downloadUrl);
    } catch (error) {
      console.error("Failed to upload image:", error);
      alert("Failed to upload image. Please check your storage settings.");
    } finally {
      setUploadLoading(false);
    }
  };

  // Reset Form Fields
  const resetForm = () => {
    setBlogTitle("");
    setBlogSlug("");
    setBlogCategory("");
    setBlogExcerpt("");
    setBlogContent("");
    setBlogThumbnail("");
    setBlogReadTime("");
    setBlogPublishedAt(new Date().toISOString().split("T")[0]);
    setBlogStatus("draft");

    setProjectTitle("");
    setProjectDescription("");
    setProjectThumbnail("");
    setProjectTechStack("");
    setProjectGithubUrl("");
    setProjectDemoUrl("");
    setProjectFeatured(false);

    setExpCompany("");
    setExpPosition("");
    setExpStartDate("");
    setExpEndDate("");
    setExpLocation("");
    setExpDescription("");
    setExpThumbnail("");

    setEditingItem(null);
    setIsFormOpen(false);
  };

  // Populate form for Edit mode
  const startEdit = (item: any) => {
    setEditingItem(item);
    setIsFormOpen(true);

    if (activeTab === "blogs") {
      setBlogTitle(item.title || "");
      setBlogSlug(item.slug || "");
      setBlogCategory(item.category || "");
      setBlogExcerpt(item.excerpt || "");
      setBlogContent(item.content || "");
      setBlogThumbnail(item.thumbnail || "");
      setBlogReadTime(item.read_time || "");
      setBlogPublishedAt(item.published_at || "");
      setBlogStatus(item.status || "draft");
    } else if (activeTab === "projects") {
      setProjectTitle(item.title || "");
      setProjectDescription(item.description || "");
      setProjectThumbnail(item.thumbnail || "");
      setProjectTechStack(item.tech_stack || "");
      setProjectGithubUrl(item.github_url || "");
      setProjectDemoUrl(item.demo_url || "");
      setProjectFeatured(item.featured || false);
    } else if (activeTab === "experiences") {
      setExpCompany(item.company || "");
      setExpPosition(item.position || "");
      setExpStartDate(item.start_date || "");
      setExpEndDate(item.end_date || "");
      setExpLocation(item.location || "");
      setExpDescription(item.description || "");
      setExpThumbnail(item.thumbnail || "");
    }
  };

  // Submit Handler (Add or Edit)
  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    let payload: any = {};
    let url = `/api/admin/${activeTab}`;
    let method = editingItem ? "PUT" : "POST";

    if (activeTab === "blogs") {
      payload = {
        title: blogTitle,
        slug: blogSlug,
        category: blogCategory,
        excerpt: blogExcerpt,
        content: blogContent,
        thumbnail: blogThumbnail,
        read_time: blogReadTime,
        published_at: blogPublishedAt,
        status: blogStatus
      };
    } else if (activeTab === "projects") {
      payload = {
        title: projectTitle,
        description: projectDescription,
        thumbnail: projectThumbnail,
        tech_stack: projectTechStack,
        github_url: projectGithubUrl,
        demo_url: projectDemoUrl,
        featured: projectFeatured,
        display_order: editingItem ? editingItem.display_order : projects.length + 1
      };
    } else if (activeTab === "experiences") {
      payload = {
        company: expCompany,
        position: expPosition,
        start_date: expStartDate,
        end_date: expEndDate,
        location: expLocation,
        description: expDescription,
        thumbnail: expThumbnail,
        display_order: editingItem ? editingItem.display_order : experiences.length + 1
      };
    }

    if (editingItem) {
      payload.id = editingItem.id;
    }

    try {
      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error("Failed to save data");
      }

      resetForm();
      fetchData();
    } catch (err: any) {
      alert(err.message || "Failed to save");
    } finally {
      setFormLoading(false);
    }
  };

  // Delete Handler
  const handleDelete = async (id: string) => {
    if (!confirm(`Are you sure you want to delete this record?`)) return;

    try {
      const res = await fetch(`/api/admin/${activeTab}?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete record");
      }

      fetchData();
    } catch (err: any) {
      alert(err.message || "Failed to delete");
    }
  };

  // Reorder Handler (Up/Down sorting)
  const handleReorder = async (index: number, direction: "up" | "down") => {
    let items = activeTab === "projects" ? [...projects] : [...experiences];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= items.length) return;

    // Swap client-side order parameters
    const temp = items[index].display_order;
    items[index].display_order = items[targetIndex].display_order;
    items[targetIndex].display_order = temp;

    // Swap items in local array
    const [movedItem] = items.splice(index, 1);
    items.splice(targetIndex, 0, movedItem);

    // Update state instantly for fast UI feedback
    if (activeTab === "projects") {
      setProjects(items);
    } else {
      setExperiences(items);
    }

    // Call API to sync reorder in database
    try {
      const reorderList = items.map((item, idx) => ({
        id: item.id,
        display_order: idx + 1 // normalized ordering
      }));

      await fetch(`/api/admin/${activeTab}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reorder",
          reorderList
        })
      });
    } catch (err) {
      console.error("Failed to sync reorder on server:", err);
    }
  };

  return (
    <>
      <Head>
        <title>Admin Dashboard | Portfolio Control</title>
        <meta name="robots" content="noindex, nofollow" />
        <link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Bebas+Neue&display=swap" rel="stylesheet" />
      </Head>

      <div className="flex h-screen bg-[#070708] text-light grain-bg overflow-hidden font-sans">
        {/* Sidebar */}
        <aside className="w-64 md:w-20 bg-dark/40 border-r border-light/10 flex flex-col justify-between flex-shrink-0 transition-all duration-300">
          <div className="flex flex-col pt-6">
            {/* Header logo */}
            <div className="px-6 md:px-0 flex items-center md:justify-center gap-2 mb-8 select-none">
              <div className="w-8 h-8 rounded bg-yellow-400 text-dark flex items-center justify-center font-['Bebas_Neue'] text-lg font-bold">
                C
              </div>
              <span className="font-['Bebas_Neue'] text-xl tracking-wider uppercase md:hidden">
                CMS Nodes
              </span>
            </div>

            {/* Nav List */}
            <nav className="space-y-1 px-3 md:px-2">
              <button
                onClick={() => { setActiveTab("dashboard"); resetForm(); }}
                className={`w-full flex items-center gap-3 md:justify-center px-4 py-3 rounded-xl transition-all font-['Share_Tech_Mono'] uppercase tracking-wider text-xs ${
                  activeTab === "dashboard"
                    ? "bg-yellow-400 text-dark font-bold shadow-md shadow-yellow-400/10"
                    : "text-light/60 hover:text-light hover:bg-white/5"
                }`}
              >
                <LayoutDashboard size={16} />
                <span className="md:hidden">Dashboard</span>
              </button>

              <button
                onClick={() => { setActiveTab("blogs"); resetForm(); }}
                className={`w-full flex items-center gap-3 md:justify-center px-4 py-3 rounded-xl transition-all font-['Share_Tech_Mono'] uppercase tracking-wider text-xs ${
                  activeTab === "blogs"
                    ? "bg-yellow-400 text-dark font-bold shadow-md shadow-yellow-400/10"
                    : "text-light/60 hover:text-light hover:bg-white/5"
                }`}
              >
                <BookOpen size={16} />
                <span className="md:hidden">Blogs</span>
              </button>

              <button
                onClick={() => { setActiveTab("projects"); resetForm(); }}
                className={`w-full flex items-center gap-3 md:justify-center px-4 py-3 rounded-xl transition-all font-['Share_Tech_Mono'] uppercase tracking-wider text-xs ${
                  activeTab === "projects"
                    ? "bg-yellow-400 text-dark font-bold shadow-md shadow-yellow-400/10"
                    : "text-light/60 hover:text-light hover:bg-white/5"
                }`}
              >
                <Briefcase size={16} />
                <span className="md:hidden">Projects</span>
              </button>

              <button
                onClick={() => { setActiveTab("experiences"); resetForm(); }}
                className={`w-full flex items-center gap-3 md:justify-center px-4 py-3 rounded-xl transition-all font-['Share_Tech_Mono'] uppercase tracking-wider text-xs ${
                  activeTab === "experiences"
                    ? "bg-yellow-400 text-dark font-bold shadow-md shadow-yellow-400/10"
                    : "text-light/60 hover:text-light hover:bg-white/5"
                }`}
              >
                <Calendar size={16} />
                <span className="md:hidden">Experience</span>
              </button>
            </nav>
          </div>

          {/* Logout */}
          <div className="p-4 border-t border-light/10">
            <button
              onClick={handleLogout}
              disabled={logoutLoading}
              className="w-full flex items-center gap-3 md:justify-center px-4 py-3 text-light/45 hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-all font-['Share_Tech_Mono'] uppercase tracking-wider text-xs border border-transparent hover:border-red-500/10"
            >
              <LogOut size={16} />
              <span className="md:hidden">Disconnect</span>
            </button>
          </div>
        </aside>

        {/* Content Pane */}
        <main className="flex-1 flex flex-col overflow-hidden bg-black/30 backdrop-blur-sm relative">
          {/* Top Bar */}
          <header className="h-16 border-b border-light/10 flex items-center justify-between px-8 md:px-6 z-10 bg-dark/20">
            <div>
              <h2 className="font-['Bebas_Neue'] text-2xl tracking-wider uppercase text-light">
                {activeTab} management
              </h2>
            </div>
            <div className="flex items-center gap-4 text-xs font-['Share_Tech_Mono'] text-light/50">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                SERVER_OK
              </span>
            </div>
          </header>

          {/* Tab Content Area */}
          <div className="flex-1 overflow-y-auto p-8 md:p-6">
            <AnimatePresence mode="wait">
              {activeTab === "dashboard" && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6 max-w-4xl"
                >
                  <div className="grid grid-cols-3 md:grid-cols-1 gap-6">
                    <div className="bg-white/3 border border-light/10 rounded-2xl p-6 flex flex-col justify-between">
                      <span className="text-light/50 font-['Share_Tech_Mono'] uppercase text-[10px] tracking-wider mb-2 block">Blog Articles</span>
                      <div className="flex justify-between items-end">
                        <span className="font-['Bebas_Neue'] text-5xl text-yellow-400">{blogs.length}</span>
                        <BookOpen className="text-light/20 mb-1" size={24} />
                      </div>
                    </div>

                    <div className="bg-white/3 border border-light/10 rounded-2xl p-6 flex flex-col justify-between">
                      <span className="text-light/50 font-['Share_Tech_Mono'] uppercase text-[10px] tracking-wider mb-2 block">Portfolio Projects</span>
                      <div className="flex justify-between items-end">
                        <span className="font-['Bebas_Neue'] text-5xl text-yellow-400">{projects.length}</span>
                        <Briefcase className="text-light/20 mb-1" size={24} />
                      </div>
                    </div>

                    <div className="bg-white/3 border border-light/10 rounded-2xl p-6 flex flex-col justify-between">
                      <span className="text-light/50 font-['Share_Tech_Mono'] uppercase text-[10px] tracking-wider mb-2 block">Timeline Experiences</span>
                      <div className="flex justify-between items-end">
                        <span className="font-['Bebas_Neue'] text-5xl text-yellow-400">{experiences.length}</span>
                        <Calendar className="text-light/20 mb-1" size={24} />
                      </div>
                    </div>
                  </div>

                  {/* Seed / Control Panel */}
                  <div className="bg-white/3 border border-light/10 rounded-2xl p-8 relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-64 h-64 bg-yellow-400/5 rounded-full blur-[100px] pointer-events-none" />
                    
                    <h3 className="font-['Bebas_Neue'] text-2xl tracking-wide uppercase text-light mb-2 flex items-center gap-2">
                      <Database className="text-yellow-400" size={20} /> Data Migration Center
                    </h3>
                    <p className="text-sm text-light/60 mb-6 max-w-xl">
                      If you're launching this CMS for the first time and your Firestore is empty, click the button below to migrate your existing static portfolio records (6 projects, 4 experiences, and 8 blog posts) directly into Firestore.
                    </p>

                    <div className="flex flex-wrap items-center gap-4">
                      <button
                        onClick={handleSeed}
                        disabled={isSeeding}
                        className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-dark font-['Share_Tech_Mono'] font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-xl transition-all disabled:opacity-40"
                      >
                        {isSeeding ? (
                          <>
                            <svg className="animate-spin h-3.5 w-3.5 text-dark" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Migrating Nodes...
                          </>
                        ) : (
                          <>
                            <Database size={13} /> Seed Initial Data
                          </>
                        )}
                      </button>
                    </div>

                    {seedResult && (
                      <div className="mt-4 p-4 border border-green-500/20 bg-green-500/5 text-green-400 rounded-xl text-xs font-['Share_Tech_Mono'] uppercase tracking-wider space-y-1">
                        <div className="flex items-center gap-2 font-bold mb-1">
                          <CheckCircle size={14} /> Migration Completed Successfully!
                        </div>
                        <div>• Blogs Seeded: {seedResult.blogsSeeded}</div>
                        <div>• Projects Seeded: {seedResult.projectsSeeded}</div>
                        <div>• Experiences Seeded: {seedResult.experiencesSeeded}</div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* CRUD Panel views for Blogs, Projects, Experiences */}
              {activeTab !== "dashboard" && (
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6"
                >
                  {/* Action Bar */}
                  {!isFormOpen && (
                    <div className="flex justify-between items-center bg-white/3 border border-light/10 p-4 rounded-2xl">
                      <span className="text-light/50 font-['Share_Tech_Mono'] text-xs uppercase tracking-wider">
                        Total Node Count: {activeTab === "blogs" ? blogs.length : activeTab === "projects" ? projects.length : experiences.length}
                      </span>
                      <button
                        onClick={() => setIsFormOpen(true)}
                        className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-dark font-['Share_Tech_Mono'] font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl transition-all"
                      >
                        <Plus size={14} /> Add new {activeTab === "blogs" ? "blog" : activeTab === "projects" ? "project" : "experience"}
                      </button>
                    </div>
                  )}

                  {/* Add / Edit Form Panel */}
                  <AnimatePresence>
                    {isFormOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-white/3 border border-light/10 rounded-2xl p-6 relative"
                      >
                        <button
                          onClick={resetForm}
                          className="absolute right-4 top-4 text-light/40 hover:text-light transition-colors"
                        >
                          <X size={18} />
                        </button>
                        
                        <h3 className="font-['Bebas_Neue'] text-xl tracking-wider uppercase text-light mb-6 flex items-center gap-2 border-b border-light/10 pb-3">
                          <Edit3 size={16} className="text-yellow-400" />
                          {editingItem ? "Edit Entry" : "Create Entry"}
                        </h3>

                        <form onSubmit={handleFormSubmit} className="space-y-6">
                          {/* -------------------- BLOGS FORM -------------------- */}
                          {activeTab === "blogs" && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 sm:grid-cols-1 gap-4">
                                <div className="space-y-1">
                                  <label className="text-2xs uppercase tracking-wider font-['Share_Tech_Mono'] text-light/60">Title</label>
                                  <input
                                    type="text" required value={blogTitle} onChange={e => setBlogTitle(e.target.value)}
                                    className="w-full bg-dark/60 border border-light/10 rounded-xl px-4 py-2.5 text-light text-sm focus:border-yellow-400/40 focus:outline-none"
                                    placeholder="Getting Started with Next.js 14"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-2xs uppercase tracking-wider font-['Share_Tech_Mono'] text-light/60">Slug (Auto-generated)</label>
                                  <input
                                    type="text" required value={blogSlug} onChange={e => setBlogSlug(e.target.value)}
                                    className="w-full bg-dark/60 border border-light/10 rounded-xl px-4 py-2.5 text-light text-sm focus:border-yellow-400/40 focus:outline-none font-mono"
                                    placeholder="getting-started-with-nextjs-14"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-3 sm:grid-cols-1 gap-4">
                                <div className="space-y-1">
                                  <label className="text-2xs uppercase tracking-wider font-['Share_Tech_Mono'] text-light/60">Category</label>
                                  <input
                                    type="text" required value={blogCategory} onChange={e => setBlogCategory(e.target.value)}
                                    className="w-full bg-dark/60 border border-light/10 rounded-xl px-4 py-2.5 text-light text-sm focus:border-yellow-400/40 focus:outline-none"
                                    placeholder="Web Development"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-2xs uppercase tracking-wider font-['Share_Tech_Mono'] text-light/60">Read Time</label>
                                  <input
                                    type="text" required value={blogReadTime} onChange={e => setBlogReadTime(e.target.value)}
                                    className="w-full bg-dark/60 border border-light/10 rounded-xl px-4 py-2.5 text-light text-sm focus:border-yellow-400/40 focus:outline-none"
                                    placeholder="5 min read"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-2xs uppercase tracking-wider font-['Share_Tech_Mono'] text-light/60">Publish Date</label>
                                  <input
                                    type="date" required value={blogPublishedAt} onChange={e => setBlogPublishedAt(e.target.value)}
                                    className="w-full bg-dark/60 border border-light/10 rounded-xl px-4 py-2.5 text-light text-sm focus:border-yellow-400/40 focus:outline-none font-mono"
                                  />
                                </div>
                              </div>

                              <div className="space-y-1">
                                <label className="text-2xs uppercase tracking-wider font-['Share_Tech_Mono'] text-light/60">Excerpt</label>
                                <textarea
                                  required value={blogExcerpt} onChange={e => setBlogExcerpt(e.target.value)} rows={2}
                                  className="w-full bg-dark/60 border border-light/10 rounded-xl px-4 py-2.5 text-light text-sm focus:border-yellow-400/40 focus:outline-none"
                                  placeholder="Learn how to build modern web applications..."
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-2xs uppercase tracking-wider font-['Share_Tech_Mono'] text-light/60 block">Thumbnail Image URL</label>
                                <div className="flex gap-2 items-center">
                                  <input
                                    type="text" required value={blogThumbnail} onChange={e => setBlogThumbnail(e.target.value)}
                                    className="flex-1 bg-dark/60 border border-light/10 rounded-xl px-4 py-2.5 text-light text-sm focus:border-yellow-400/40 focus:outline-none font-mono"
                                    placeholder="https://images.unsplash.com/... or upload"
                                  />
                                  <label className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-light border border-light/15 px-4 py-2.5 rounded-xl cursor-pointer transition-colors text-xs font-['Share_Tech_Mono'] uppercase tracking-wider">
                                    <Upload size={14} /> {uploadLoading ? "Uploading..." : "Upload"}
                                    <input
                                      type="file" accept="image/*" disabled={uploadLoading}
                                      onChange={(e) => handleImageUpload(e, setBlogThumbnail)}
                                      className="hidden"
                                    />
                                  </label>
                                </div>
                              </div>

                              {/* Dual Panel Editor: Left Editor, Right Live Render */}
                              <div className="grid grid-cols-2 lg:grid-cols-1 gap-6 pt-2">
                                <div className="space-y-1">
                                  <label className="text-2xs uppercase tracking-wider font-['Share_Tech_Mono'] text-light/60">Markdown / Article Body Content</label>
                                  <textarea
                                    required value={blogContent} onChange={e => setBlogContent(e.target.value)} rows={12}
                                    className="w-full bg-dark/60 border border-light/10 rounded-xl p-4 text-light text-sm focus:border-yellow-400/40 focus:outline-none font-mono leading-relaxed"
                                    placeholder="# Introduction\n\nWrite your blog content here in markdown formats..."
                                  />
                                </div>
                                <div className="space-y-1 border border-light/10 rounded-xl bg-dark/30 p-4 max-h-[300px] overflow-y-auto">
                                  <div className="text-2xs uppercase tracking-wider font-['Share_Tech_Mono'] text-light/40 border-b border-light/5 pb-2 mb-2 flex items-center gap-1.5">
                                    <Eye size={12} /> Content Render Preview
                                  </div>
                                  <div className="prose prose-invert max-w-none text-light/85 text-sm whitespace-pre-wrap leading-relaxed">
                                    {blogContent || <span className="text-light/30 italic">Preview screen empty...</span>}
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-1">
                                <label className="text-2xs uppercase tracking-wider font-['Share_Tech_Mono'] text-light/60">Publication Status</label>
                                <select
                                  value={blogStatus} onChange={e => setBlogStatus(e.target.value)}
                                  className="w-full bg-dark/60 border border-light/10 rounded-xl px-4 py-2.5 text-light text-sm focus:border-yellow-400/40 focus:outline-none cursor-pointer"
                                >
                                  <option value="draft" className="bg-dark text-light">Draft (Secret/Offline)</option>
                                  <option value="published" className="bg-dark text-light">Published (Public)</option>
                                </select>
                              </div>
                            </div>
                          )}

                          {/* -------------------- PROJECTS FORM -------------------- */}
                          {activeTab === "projects" && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 sm:grid-cols-1 gap-4">
                                <div className="space-y-1">
                                  <label className="text-2xs uppercase tracking-wider font-['Share_Tech_Mono'] text-light/60">Project Name</label>
                                  <input
                                    type="text" required value={projectTitle} onChange={e => setProjectTitle(e.target.value)}
                                    className="w-full bg-dark/60 border border-light/10 rounded-xl px-4 py-2.5 text-light text-sm focus:border-yellow-400/40 focus:outline-none"
                                    placeholder="Turbines HRIS"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-2xs uppercase tracking-wider font-['Share_Tech_Mono'] text-light/60">Tech Stack (Divided by |)</label>
                                  <input
                                    type="text" required value={projectTechStack} onChange={e => setProjectTechStack(e.target.value)}
                                    className="w-full bg-dark/60 border border-light/10 rounded-xl px-4 py-2.5 text-light text-sm focus:border-yellow-400/40 focus:outline-none font-mono"
                                    placeholder="Next.js | CSS | Framer Motion"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-2 sm:grid-cols-1 gap-4">
                                <div className="space-y-1">
                                  <label className="text-2xs uppercase tracking-wider font-['Share_Tech_Mono'] text-light/60 flex items-center gap-1.5"><Globe size={11} /> Live Demo URL (Optional)</label>
                                  <input
                                    type="url" value={projectDemoUrl} onChange={e => setProjectDemoUrl(e.target.value)}
                                    className="w-full bg-dark/60 border border-light/10 rounded-xl px-4 py-2.5 text-light text-sm focus:border-yellow-400/40 focus:outline-none font-mono"
                                    placeholder="https://myproject.com"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-2xs uppercase tracking-wider font-['Share_Tech_Mono'] text-light/60 flex items-center gap-1.5"><GitBranch size={11} /> GitHub Repo URL (Optional)</label>
                                  <input
                                    type="url" value={projectGithubUrl} onChange={e => setProjectGithubUrl(e.target.value)}
                                    className="w-full bg-dark/60 border border-light/10 rounded-xl px-4 py-2.5 text-light text-sm focus:border-yellow-400/40 focus:outline-none font-mono"
                                    placeholder="https://github.com/myusername/myproject"
                                  />
                                </div>
                              </div>

                              <div className="space-y-1">
                                <label className="text-2xs uppercase tracking-wider font-['Share_Tech_Mono'] text-light/60 block">Thumbnail Image</label>
                                <div className="flex gap-2 items-center">
                                  <input
                                    type="text" required value={projectThumbnail} onChange={e => setProjectThumbnail(e.target.value)}
                                    className="flex-1 bg-dark/60 border border-light/10 rounded-xl px-4 py-2.5 text-light text-sm focus:border-yellow-400/40 focus:outline-none font-mono"
                                    placeholder="/images/projects/myproject.png or remote URL"
                                  />
                                  <label className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-light border border-light/15 px-4 py-2.5 rounded-xl cursor-pointer transition-colors text-xs font-['Share_Tech_Mono'] uppercase tracking-wider">
                                    <Upload size={14} /> {uploadLoading ? "Uploading..." : "Upload"}
                                    <input
                                      type="file" accept="image/*" disabled={uploadLoading}
                                      onChange={(e) => handleImageUpload(e, setProjectThumbnail)}
                                      className="hidden"
                                    />
                                  </label>
                                </div>
                              </div>

                              <div className="space-y-1">
                                <label className="text-2xs uppercase tracking-wider font-['Share_Tech_Mono'] text-light/60">Short Summary</label>
                                <textarea
                                  required value={projectDescription} onChange={e => setProjectDescription(e.target.value)} rows={3}
                                  className="w-full bg-dark/60 border border-light/10 rounded-xl px-4 py-2.5 text-light text-sm focus:border-yellow-400/40 focus:outline-none"
                                  placeholder="A human resource information system built to streamline administrative workflows..."
                                />
                              </div>

                              <div className="flex items-center gap-3 pt-2">
                                <input
                                  type="checkbox" id="projectFeatured" checked={projectFeatured} onChange={e => setProjectFeatured(e.target.checked)}
                                  className="w-4 h-4 rounded border-light/20 bg-dark text-yellow-400 focus:ring-0 cursor-pointer"
                                />
                                <label htmlFor="projectFeatured" className="text-xs font-['Share_Tech_Mono'] uppercase tracking-wider text-light/80 select-none cursor-pointer">
                                  Pin as Featured Project
                                </label>
                              </div>
                            </div>
                          )}

                          {/* -------------------- EXPERIENCES FORM -------------------- */}
                          {activeTab === "experiences" && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 sm:grid-cols-1 gap-4">
                                <div className="space-y-1">
                                  <label className="text-2xs uppercase tracking-wider font-['Share_Tech_Mono'] text-light/60">Company / Organization</label>
                                  <input
                                    type="text" required value={expCompany} onChange={e => setExpCompany(e.target.value)}
                                    className="w-full bg-dark/60 border border-light/10 rounded-xl px-4 py-2.5 text-light text-sm focus:border-yellow-400/40 focus:outline-none"
                                    placeholder="Maritim Muda Nusantara"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-2xs uppercase tracking-wider font-['Share_Tech_Mono'] text-light/60">Role / Position</label>
                                  <input
                                    type="text" required value={expPosition} onChange={e => setExpPosition(e.target.value)}
                                    className="w-full bg-dark/60 border border-light/10 rounded-xl px-4 py-2.5 text-light text-sm focus:border-yellow-400/40 focus:outline-none"
                                    placeholder="Web Developer"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-3 sm:grid-cols-1 gap-4">
                                <div className="space-y-1">
                                  <label className="text-2xs uppercase tracking-wider font-['Share_Tech_Mono'] text-light/60">Start Date</label>
                                  <input
                                    type="text" required value={expStartDate} onChange={e => setExpStartDate(e.target.value)}
                                    className="w-full bg-dark/60 border border-light/10 rounded-xl px-4 py-2.5 text-light text-sm focus:border-yellow-400/40 focus:outline-none font-mono"
                                    placeholder="Des 2025"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-2xs uppercase tracking-wider font-['Share_Tech_Mono'] text-light/60">End Date</label>
                                  <input
                                    type="text" required value={expEndDate} onChange={e => setExpEndDate(e.target.value)}
                                    className="w-full bg-dark/60 border border-light/10 rounded-xl px-4 py-2.5 text-light text-sm focus:border-yellow-400/40 focus:outline-none font-mono"
                                    placeholder="Jun 2026 (or Present)"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-2xs uppercase tracking-wider font-['Share_Tech_Mono'] text-light/60">Location</label>
                                  <input
                                    type="text" required value={expLocation} onChange={e => setExpLocation(e.target.value)}
                                    className="w-full bg-dark/60 border border-light/10 rounded-xl px-4 py-2.5 text-light text-sm focus:border-yellow-400/40 focus:outline-none"
                                    placeholder="Jakarta, Indonesia"
                                  />
                                </div>
                              </div>

                              <div className="space-y-1">
                                <label className="text-2xs uppercase tracking-wider font-['Share_Tech_Mono'] text-light/60 block">Company Logo Image</label>
                                <div className="flex gap-2 items-center">
                                  <input
                                    type="text" required value={expThumbnail} onChange={e => setExpThumbnail(e.target.value)}
                                    className="flex-1 bg-dark/60 border border-light/10 rounded-xl px-4 py-2.5 text-light text-sm focus:border-yellow-400/40 focus:outline-none font-mono"
                                    placeholder="/images/logo-maritim.png or remote URL"
                                  />
                                  <label className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-light border border-light/15 px-4 py-2.5 rounded-xl cursor-pointer transition-colors text-xs font-['Share_Tech_Mono'] uppercase tracking-wider">
                                    <Upload size={14} /> {uploadLoading ? "Uploading..." : "Upload"}
                                    <input
                                      type="file" accept="image/*" disabled={uploadLoading}
                                      onChange={(e) => handleImageUpload(e, setExpThumbnail)}
                                      className="hidden"
                                    />
                                  </label>
                                </div>
                              </div>

                              <div className="space-y-1">
                                <label className="text-2xs uppercase tracking-wider font-['Share_Tech_Mono'] text-light/60">Work Description / Responsibilities</label>
                                <textarea
                                  required value={expDescription} onChange={e => setExpDescription(e.target.value)} rows={4}
                                  className="w-full bg-dark/60 border border-light/10 rounded-xl px-4 py-2.5 text-light text-sm focus:border-yellow-400/40 focus:outline-none"
                                  placeholder="Developing and maintaining websites using Next.js and Tailwind..."
                                />
                              </div>
                            </div>
                          )}

                          {/* Submit Actions */}
                          <div className="flex gap-3 justify-end border-t border-light/10 pt-4">
                            <button
                              type="button" onClick={resetForm}
                              className="bg-white/5 hover:bg-white/10 text-light border border-light/15 font-['Share_Tech_Mono'] font-bold text-xs uppercase tracking-wider py-2.5 px-6 rounded-xl transition-all"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit" disabled={formLoading}
                              className="bg-yellow-400 hover:bg-yellow-300 text-dark font-['Share_Tech_Mono'] font-bold text-xs uppercase tracking-wider py-2.5 px-6 rounded-xl transition-all disabled:opacity-40"
                            >
                              {formLoading ? "Saving..." : "Save Entry"}
                            </button>
                          </div>
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Listings Table / Cards */}
                  {!isFormOpen && (
                    <div className="space-y-4">
                      {loadingData ? (
                        <div className="text-center py-20 text-light/50 font-['Share_Tech_Mono'] uppercase tracking-wider">
                          Loading nodes from DB...
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {/* -------------------- BLOGS LIST -------------------- */}
                          {activeTab === "blogs" && (
                            blogs.length === 0 ? (
                              <div className="text-center py-16 border border-dashed border-light/10 rounded-2xl text-light/40 text-xs font-['Share_Tech_Mono'] uppercase tracking-wider">
                                No blogs found. Try Seeding Initial Data first.
                              </div>
                            ) : (
                              blogs.map((blog) => (
                                <div key={blog.id} className="flex md:flex-col justify-between items-center md:items-start p-5 bg-white/3 border border-light/10 rounded-xl gap-4 hover:border-light/20 transition-all">
                                  <div className="flex items-center gap-4 min-w-0 flex-1">
                                    <div className="w-16 h-10 bg-dark rounded border border-light/10 overflow-hidden relative flex-shrink-0">
                                      {blog.thumbnail && <img src={blog.thumbnail} alt="" className="w-full h-full object-cover" />}
                                    </div>
                                    <div className="min-w-0">
                                      <div className="flex items-center gap-2 mb-0.5">
                                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full border border-light/20 bg-light/5 uppercase tracking-wider text-light/50">{blog.category}</span>
                                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${
                                          blog.status === "published"
                                            ? "border-green-500/20 bg-green-500/5 text-green-400"
                                            : "border-yellow-500/20 bg-yellow-500/5 text-yellow-400"
                                        }`}>{blog.status}</span>
                                      </div>
                                      <h4 className="text-sm font-bold text-light truncate">{blog.title}</h4>
                                      <p className="text-2xs text-light/40 font-mono mt-0.5 truncate">{blog.slug}</p>
                                    </div>
                                  </div>

                                  <div className="flex gap-2 items-center flex-shrink-0 md:w-full md:justify-end">
                                    <button
                                      onClick={() => startEdit(blog)}
                                      className="p-2 text-light/60 hover:text-light border border-light/10 hover:border-light/30 rounded-lg transition-colors bg-white/5"
                                      title="Edit"
                                    >
                                      <Edit3 size={14} />
                                    </button>
                                    <button
                                      onClick={() => handleDelete(blog.id)}
                                      className="p-2 text-light/40 hover:text-red-400 border border-light/10 hover:border-red-500/20 hover:bg-red-500/5 rounded-lg transition-colors"
                                      title="Delete"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                </div>
                              ))
                            )
                          )}

                          {/* -------------------- PROJECTS LIST -------------------- */}
                          {activeTab === "projects" && (
                            projects.length === 0 ? (
                              <div className="text-center py-16 border border-dashed border-light/10 rounded-2xl text-light/40 text-xs font-['Share_Tech_Mono'] uppercase tracking-wider">
                                No projects found. Try Seeding Initial Data first.
                              </div>
                            ) : (
                              projects.map((proj, idx) => (
                                <div key={proj.id} className="flex md:flex-col justify-between items-center md:items-start p-5 bg-white/3 border border-light/10 rounded-xl gap-4 hover:border-light/20 transition-all">
                                  <div className="flex items-center gap-4 min-w-0 flex-1">
                                    <span className="font-['Bebas_Neue'] text-xl text-light/30 select-none w-6 text-right">{idx + 1}</span>
                                    <div className="w-16 h-10 bg-dark rounded border border-light/10 overflow-hidden relative flex-shrink-0">
                                      {proj.thumbnail && <img src={proj.thumbnail} alt="" className="w-full h-full object-cover" />}
                                    </div>
                                    <div className="min-w-0">
                                      <div className="flex items-center gap-2 mb-0.5">
                                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full border border-light/20 bg-light/5 uppercase tracking-wider text-light/50 font-mono">{proj.tech_stack}</span>
                                        {proj.featured && (
                                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full border border-yellow-500/20 bg-yellow-500/5 text-yellow-400 uppercase tracking-wider font-mono">Featured</span>
                                        )}
                                      </div>
                                      <h4 className="text-sm font-bold text-light truncate">{proj.title}</h4>
                                      <p className="text-2xs text-light/40 font-mono mt-0.5 truncate">{proj.demo_url || "No demo link"}</p>
                                    </div>
                                  </div>

                                  <div className="flex gap-2 items-center flex-shrink-0 md:w-full md:justify-end">
                                    {/* Ordering controls */}
                                    <div className="flex flex-col gap-1 mr-2">
                                      <button
                                        onClick={() => handleReorder(idx, "up")}
                                        disabled={idx === 0}
                                        className="p-1 text-light/40 hover:text-light disabled:opacity-10 transition-colors"
                                        title="Move Up"
                                      >
                                        <ArrowUp size={12} />
                                      </button>
                                      <button
                                        onClick={() => handleReorder(idx, "down")}
                                        disabled={idx === projects.length - 1}
                                        className="p-1 text-light/40 hover:text-light disabled:opacity-10 transition-colors"
                                        title="Move Down"
                                      >
                                        <ArrowDown size={12} />
                                      </button>
                                    </div>
                                    
                                    <button
                                      onClick={() => startEdit(proj)}
                                      className="p-2 text-light/60 hover:text-light border border-light/10 hover:border-light/30 rounded-lg transition-colors bg-white/5"
                                      title="Edit"
                                    >
                                      <Edit3 size={14} />
                                    </button>
                                    <button
                                      onClick={() => handleDelete(proj.id)}
                                      className="p-2 text-light/40 hover:text-red-400 border border-light/10 hover:border-red-500/20 hover:bg-red-500/5 rounded-lg transition-colors"
                                      title="Delete"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                </div>
                              ))
                            )
                          )}

                          {/* -------------------- EXPERIENCES LIST -------------------- */}
                          {activeTab === "experiences" && (
                            experiences.length === 0 ? (
                              <div className="text-center py-16 border border-dashed border-light/10 rounded-2xl text-light/40 text-xs font-['Share_Tech_Mono'] uppercase tracking-wider">
                                No experience entries found. Try Seeding Initial Data first.
                              </div>
                            ) : (
                              experiences.map((exp, idx) => (
                                <div key={exp.id} className="flex md:flex-col justify-between items-center md:items-start p-5 bg-white/3 border border-light/10 rounded-xl gap-4 hover:border-light/20 transition-all">
                                  <div className="flex items-center gap-4 min-w-0 flex-1">
                                    <span className="font-['Bebas_Neue'] text-xl text-light/30 select-none w-6 text-right">{idx + 1}</span>
                                    <div className="w-10 h-10 bg-dark rounded border border-light/10 overflow-hidden relative flex-shrink-0 flex items-center justify-center">
                                      {exp.thumbnail ? (
                                        <img src={exp.thumbnail} alt="" className="w-full h-full object-contain" />
                                      ) : (
                                        <span className="text-[9px] text-light/20">NO LOGO</span>
                                      )}
                                    </div>
                                    <div className="min-w-0">
                                      <div className="flex items-center gap-2 mb-0.5">
                                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full border border-light/20 bg-light/5 uppercase tracking-wider text-light/50 font-mono">{exp.start_date} – {exp.end_date}</span>
                                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full border border-light/20 bg-light/5 uppercase tracking-wider text-light/40 font-mono">{exp.location}</span>
                                      </div>
                                      <h4 className="text-sm font-bold text-light">{exp.company}</h4>
                                      <p className="text-xs text-light/60 mt-0.5">{exp.position}</p>
                                    </div>
                                  </div>

                                  <div className="flex gap-2 items-center flex-shrink-0 md:w-full md:justify-end">
                                    {/* Ordering controls */}
                                    <div className="flex flex-col gap-1 mr-2">
                                      <button
                                        onClick={() => handleReorder(idx, "up")}
                                        disabled={idx === 0}
                                        className="p-1 text-light/40 hover:text-light disabled:opacity-10 transition-colors"
                                        title="Move Up"
                                      >
                                        <ArrowUp size={12} />
                                      </button>
                                      <button
                                        onClick={() => handleReorder(idx, "down")}
                                        disabled={idx === experiences.length - 1}
                                        className="p-1 text-light/40 hover:text-light disabled:opacity-10 transition-colors"
                                        title="Move Down"
                                      >
                                        <ArrowDown size={12} />
                                      </button>
                                    </div>

                                    <button
                                      onClick={() => startEdit(exp)}
                                      className="p-2 text-light/60 hover:text-light border border-light/10 hover:border-light/30 rounded-lg transition-colors bg-white/5"
                                      title="Edit"
                                    >
                                      <Edit3 size={14} />
                                    </button>
                                    <button
                                      onClick={() => handleDelete(exp.id)}
                                      className="p-2 text-light/40 hover:text-red-400 border border-light/10 hover:border-red-500/20 hover:bg-red-500/5 rounded-lg transition-colors"
                                      title="Delete"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                </div>
                              ))
                            )
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </>
  );
}

export async function getServerSideProps(context: any) {
  const { verifySession } = await import("@/lib/adminAuth");
  const isValid = await verifySession(context.req);

  if (!isValid) {
    return {
      redirect: {
        destination: "/admin",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
