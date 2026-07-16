import { NextApiRequest, NextApiResponse } from "next";
import { verifySession } from "@/lib/adminAuth";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";

const SEED_BLOGS = [
  {
    title: "Menjelajahi Fitur Baru Next.js 15: React Compiler & Server Actions",
    slug: "fitur-baru-nextjs-15-react-compiler",
    category: "Next.js",
    excerpt: "Ulasan mendalam mengenai fitur terbaru di Next.js 15, mulai dari otomatisasi optimasi komponen hingga kestabilan Server Actions.",
    content: "Next.js 15 membawa perubahan besar bagi ekosistem React. Salah satu fitur yang paling dinantikan adalah **React Compiler** yang kini terintegrasi secara bawaan.\n\n# Apa itu React Compiler?\nSebelumnya, kita harus menulis `useMemo` dan `useCallback` secara manual untuk mencegah render ulang komponen yang tidak perlu. Sekarang, compiler akan menganalisis kode kita dan mengoptimasinya secara otomatis.\n\n> \"React Compiler membuat penulisan kode React menjadi lebih bersih tanpa mengorbankan performa.\"\n\n# 3 Fitur Unggulan Next.js 15\n- **React Compiler (BETA)**: Optimasi otomatis tingkat komponen untuk render cepat.\n- **Server Actions Stable**: Pengiriman data formulir server-side kini jauh lebih aman.\n- **Caching Behavior Update**: Caching untuk `fetch` kini mati secara default untuk menyajikan data yang lebih segar.",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
    read_time: "5 min read",
    published_at: "2026-07-16",
    status: "published"
  },
  {
    title: "Panduan Memulai Tailwind CSS v4: Performa Lebih Cepat & Konfigurasi CSS-First",
    slug: "panduan-tailwind-css-v4-config-baru",
    category: "CSS",
    excerpt: "Tailwind CSS v4 hadir dengan engine compiler Rust baru dan sistem konfigurasi berbasis CSS. Pelajari cara migrasinya di sini.",
    content: "Tailwind CSS v4.0 memperkenalkan arsitektur baru yang didesain untuk performa maksimal dengan engine berbasis Rust.\n\n# Konfigurasi Baru: CSS-First\nDi versi 3, kita menggunakan `tailwind.config.js` untuk kustomisasi tema. Di versi 4, konfigurasi dilakukan langsung di dalam file CSS utama menggunakan `@theme`:\n\n```css\n@theme {\n  --color-brand-primary: #facc15;\n  --font-display: \"Bebas Neue\", sans-serif;\n}\n```\n\n# Keuntungan Menggunakan Tailwind v4\n- **Kecepatan Build 10x Lipat**: Berkat engine Rust compiler yang super cepat.\n- **Ukuran Bundle Lebih Kecil**: Deteksi utility classes yang lebih pintar.\n- **Zero Configuration**: Cukup arahkan compiler ke file CSS utama Anda.",
    thumbnail: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800&q=80",
    read_time: "4 min read",
    published_at: "2026-07-10",
    status: "published"
  },
  {
    title: "Mengenal GSAP ScrollTrigger untuk Animasi Web Interaktif",
    slug: "mengenal-gsap-scrolltrigger-animasi-interaktif",
    category: "Animation",
    excerpt: "Pelajari cara membuat animasi scroll-driven yang halus dan memukau menggunakan GSAP ScrollTrigger di Next.js.",
    content: "Animasi berbasis scroll dapat mengubah situs web biasa menjadi pengalaman interaktif yang memukau. GSAP ScrollTrigger adalah standar industri untuk hal ini.\n\n# Cara Kerja ScrollTrigger\nScrollTrigger menghubungkan progress animasi GSAP (Timeline) dengan posisi scroll halaman pengguna.\n\n```javascript\ngsap.to(\".box\", {\n  scrollTrigger: {\n    trigger: \".box\",\n    start: \"top center\",\n    end: \"bottom top\",\n    scrub: true\n  },\n  x: 500,\n  rotation: 360\n});\n```\n\n# Tips Animasi Scroll yang Baik\n- **Gunakan `scrub`**: Menghubungkan durasi animasi langsung dengan kecepatan scroll pengguna.\n- **Optimasi Performa**: Jangan menganimasikan properti berat seperti `width`, `height`, atau `top`. Gunakan `x`, `y`, `scale`, dan `opacity`.",
    thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80",
    read_time: "7 min read",
    published_at: "2026-07-02",
    status: "published"
  },
  {
    title: "Mengapa TypeScript Sangat Penting untuk Proyek Skala Besar?",
    slug: "mengapa-typescript-penting-proyek-skala-besar",
    category: "TypeScript",
    excerpt: "Menjelaskan keuntungan menggunakan TypeScript dalam pengembangan aplikasi web tim untuk menghindari bug runtime.",
    content: "TypeScript bukan sekadar tambahan sintaks di atas JavaScript. Ia adalah alat bantu penulisan kode yang menjamin keamanan tipe data di seluruh aplikasi Anda.\n\n# Mencegah Bug Sebelum Terjadi\nDengan sistem pengecekan statik, TypeScript mendeteksi kesalahan penulisan properti objek sebelum kode Anda dikompilasi ke browser.\n\n> \"Lebih baik menemukan error saat menulis kode (build-time) daripada saat aplikasi sudah diakses pengguna (runtime).\"\n\n# 3 Alasan Utama Menggunakan TypeScript\n- **Autocompletion Maksimal**: IDE Anda akan tahu persis properti apa saja yang tersedia di dalam objek.\n- **Refactoring Aman**: Mengubah nama fungsi di satu file akan otomatis ter-update di seluruh proyek dengan aman.\n- **Dokumentasi Hidup**: Type definitions bertindak sebagai panduan bagi developer lain dalam tim.",
    thumbnail: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&q=80",
    read_time: "6 min read",
    published_at: "2026-07-01",
    status: "published"
  },
  {
    title: "Integrasi AI di Web: Panduan Praktis API Gemini untuk Pemula",
    slug: "integrasi-ai-api-gemini-web-pemula",
    category: "Artificial Intelligence",
    excerpt: "Cara menghubungkan API Gemini AI dari Google ke dalam aplikasi web JavaScript untuk fitur chat dan analisis teks.",
    content: "Kecerdasan Buatan (AI) kini sangat mudah diintegrasikan ke dalam aplikasi web kita menggunakan API Gemini dari Google.\n\n# Mulai Menggunakan API Gemini\nCukup pasang modul resmi `@google/generative-ai` dan inisialisasi dengan API Key Anda:\n\n```javascript\nconst { GoogleGenAI } = require('@google/generative-ai');\nconst ai = new GoogleGenAI({ apiKey: \"API_KEY_ANDA\" });\n\nconst response = await ai.models.generateContent({\n  model: \"gemini-1.5-flash\",\n  prompt: \"Jelaskan apa itu web development dalam satu kalimat.\"\n});\nconsole.log(response.text);\n```\n\n# Ide Implementasi AI di Portofolio\n- **Chatbot Asisten Pribadi**: Menjawab pertanyaan pengunjung mengenai keahlian Anda.\n- **Auto-tagging**: Mengelompokkan proyek portofolio secara otomatis berdasarkan deskripsi teks.",
    thumbnail: "https://images.unsplash.com/photo-1523437113738-bbd3cc89fb19?w=800&q=80",
    read_time: "5 min read",
    published_at: "2026-06-28",
    status: "published"
  }
];

const SEED_PROJECTS = [
  {
    title: "Word Wide Global Indonesia",
    description: "Website company profile for PT. World Wide Global Indonesia, designed to showcase global logistics and import services.",
    thumbnail: "/images/projects/wwgi.png",
    tech_stack: "Next.js",
    github_url: "",
    demo_url: "https://www.wwgimpor.id/",
    featured: true,
    display_order: 1
  },
  {
    title: "Maritim X Academy",
    description: "An interactive online academy platform developed for Maritim Muda Nusantara, supporting maritime education.",
    thumbnail: "/images/projects/MaritimX.png",
    tech_stack: "React.js | Tailwind",
    github_url: "",
    demo_url: "https://maritimx.id/",
    featured: true,
    display_order: 2
  },
  {
    title: "Turbines HRIS",
    description: "A robust human resource information system built for Maritim Muda Nusantara to streamline administrative workflows.",
    thumbnail: "/images/projects/turbines.png",
    tech_stack: "Next.js | CSS",
    github_url: "",
    demo_url: "https://turbines.maritimepreneur.com/login",
    featured: true,
    display_order: 3
  },
  {
    title: "DICEPATIN Logistics",
    description: "A comprehensive shipping and tracking application developed to check delivery rates and track courier shipments.",
    thumbnail: "/images/projects/dicepatin.png",
    tech_stack: "Vue.js | Laravel",
    github_url: "",
    demo_url: "",
    featured: true,
    display_order: 4
  },
  {
    title: "Rinso.com Clone",
    description: "A responsive front-end clone of the official Rinso website, developed using Tailwind CSS for clean layout parity.",
    thumbnail: "/images/projects/clone-rinso.png",
    tech_stack: "Tailwind | HTML",
    github_url: "",
    demo_url: "",
    featured: true,
    display_order: 5
  },
  {
    title: "Jaringan Doa Platform",
    description: "A community-focused spiritual platform designed for users to share and participate in mutual prayer networks.",
    thumbnail: "/images/projects/jaringan-doa.png",
    tech_stack: "Vue.js | Laravel",
    github_url: "",
    demo_url: "",
    featured: true,
    display_order: 6
  }
];

const SEED_EXPERIENCES = [
  {
    company: "Maritim Muda Nusantara",
    position: "Web Developer",
    start_date: "Des 2025",
    end_date: "Jun 2026",
    location: "Jakarta, Indonesia",
    description: "Developing and maintaining websites",
    thumbnail: "/images/logo-maritim.png",
    display_order: 1
  },
  {
    company: "SDA Media",
    position: "Fullstack Developer",
    start_date: "2024",
    end_date: "2024",
    location: "Jakarta, Indonesia",
    description: "Developing and maintaining websites using Laravel and MySQL. Collaborating in project planning, code reviews, and sprint planning. Active in technical requirements meetings and using GitLab for version control. Contributing to application testing with focus on bug identification and performance improvements.",
    thumbnail: "/images/logo-sda.png",
    display_order: 2
  },
  {
    company: "Bangkit Academy",
    position: "Cloud Engineer Cohort",
    start_date: "Feb 2024",
    end_date: "July 2024",
    location: "Jakarta, Indonesia",
    description: "Led by Google, Tokopedia, Gojek, & Traveloka. Intensive program focused on cloud computing technologies and best practices.",
    thumbnail: "/images/logo-bangkit.png",
    display_order: 3
  },
  {
    company: "Universitas Advent Indonesia",
    position: "Dormitory Monitor",
    start_date: "2021",
    end_date: "2023",
    location: "Bandung, Indonesia",
    description: "Monitored and maintained orderliness of students living in the men's dormitory, ensuring a conducive living environment.",
    thumbnail: "/images/logo-unai.png",
    display_order: 4
  }
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const isValid = await verifySession(req);
  if (!isValid) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Seed Blogs
    let seededBlogsCount = 0;
    for (const blog of SEED_BLOGS) {
      const docId = blog.slug;
      await setDoc(doc(db, "blogs", docId), {
        ...blog,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      seededBlogsCount++;
    }

    // Seed Projects
    let seededProjectsCount = 0;
    for (const project of SEED_PROJECTS) {
      const docId = project.title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "");
      await setDoc(doc(db, "projects", docId), {
        ...project,
        createdAt: new Date().toISOString()
      });
      seededProjectsCount++;
    }

    // Seed Experiences
    let seededExperiencesCount = 0;
    for (const exp of SEED_EXPERIENCES) {
      const docId = exp.company.toLowerCase().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "");
      await setDoc(doc(db, "experiences", docId), {
        ...exp,
        createdAt: new Date().toISOString()
      });
      seededExperiencesCount++;
    }

    return res.status(200).json({
      success: true,
      blogsSeeded: seededBlogsCount,
      projectsSeeded: seededProjectsCount,
      experiencesSeeded: seededExperiencesCount,
    });
  } catch (error: any) {
    console.error("Seeding API error:", error);
    return res.status(500).json({ error: error.message || "Failed to seed data" });
  }
}
