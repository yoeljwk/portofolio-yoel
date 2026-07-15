import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Loading from "@/components/Loading";
import "@/styles/globals.css";
import { AnimatePresence } from "framer-motion";
import { Montserrat } from "next/font/google";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import TopProgressBar from "@/components/TopProgressBar";
import LiveChat from "@/components/LiveChat";
import Sidebar from "@/components/Sidebar";
import { X } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReact } from "@fortawesome/free-brands-svg-icons";

const TsxIcon = ({ size, className }: { size?: number; className?: string }) => (
  <FontAwesomeIcon
    icon={faReact}
    style={{ width: size || 14, height: size || 14 }}
    className={className}
  />
);

const pageFiles = [
  { name: "index.tsx", path: "/", label: "Home", icon: TsxIcon, color: "text-blue-400" },
  { name: "about.tsx", path: "/about", label: "About Me", icon: TsxIcon, color: "text-cyan-400" },
  { name: "projects.tsx", path: "/projects", label: "Projects", icon: TsxIcon, color: "text-cyan-400" },
  { name: "blog.tsx", path: "/blog", label: "Blog", icon: TsxIcon, color: "text-cyan-400" },
  { name: "guestbook.tsx", path: "/guestbook", label: "Guestbook", icon: TsxIcon, color: "text-cyan-400" },
];

const pathToFileMap = {
  "/": "index.tsx",
  "/about": "about.tsx",
  "/projects": "projects.tsx",
  "/blog": "blog.tsx",
  "/guestbook": "guestbook.tsx",
};

const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-mont" });

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<string | null>("explorer");
  const [navMode, setNavMode] = useState<"sidebar" | "navbar">("sidebar");
  const [openTabs, setOpenTabs] = useState<string[]>([]);
  const isAboutPage = router.pathname === '/about';

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const savedMode = localStorage.getItem("portfolio-nav-mode");
    if (savedMode === "sidebar" || savedMode === "navbar") {
      // On mobile, always force navbar regardless of saved preference
      if (window.innerWidth < 1024) {
        setNavMode("navbar");
      } else {
        setNavMode(savedMode);
      }
    } else {
      // No saved preference — default to navbar on mobile
      if (window.innerWidth < 1024) {
        setNavMode("navbar");
      }
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setNavMode("navbar");
      } else {
        const savedMode = localStorage.getItem("portfolio-nav-mode");
        if (savedMode === "sidebar" || savedMode === "navbar") {
          setNavMode(savedMode);
        } else {
          setNavMode("sidebar");
        }
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const savedTabs = localStorage.getItem("portfolio-open-tabs");
    let tabs = ["index.tsx"];
    if (savedTabs) {
      try {
        const parsed = JSON.parse(savedTabs);
        if (Array.isArray(parsed) && parsed.length > 0) {
          tabs = parsed;
        }
      } catch (e) {}
    }
    const currentFile = pathToFileMap[router.pathname];
    if (currentFile && !tabs.includes(currentFile)) {
      tabs.push(currentFile);
    }
    setOpenTabs(tabs);
  }, []);

  useEffect(() => {
    if (openTabs.length > 0) {
      localStorage.setItem("portfolio-open-tabs", JSON.stringify(openTabs));
    }
  }, [openTabs]);

  useEffect(() => {
    const currentFile = pathToFileMap[router.pathname];
    if (currentFile) {
      setOpenTabs((prev) => {
        if (prev.includes(currentFile)) return prev;
        return [...prev, currentFile];
      });
    }
  }, [router.pathname]);

  const handleSetNavMode = (mode: "sidebar" | "navbar") => {
    setNavMode(mode);
    localStorage.setItem("portfolio-nav-mode", mode);
  };

  const handleCloseTab = (filename: string) => {
    const newTabs = openTabs.filter((t) => t !== filename);
    if (newTabs.length === 0) {
      setOpenTabs(["index.tsx"]);
      router.push("/");
      return;
    }
    setOpenTabs(newTabs);
    const currentFile = pathToFileMap[router.pathname];
    if (currentFile === filename) {
      const lastTab = newTabs[newTabs.length - 1];
      const page = pageFiles.find(p => p.name === lastTab);
      if (page) {
        router.push(page.path);
      }
    }
  };

  return (
    <>
      <TopProgressBar />
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="robots" content="index, follow" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://api.openweathermap.org" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </Head>
      <AnimatePresence mode="wait">
        {loading && <Loading key="loading" />}
      </AnimatePresence>
      {loading && (
        <style jsx global>{`
          html, body {
            overflow: hidden !important;
          }
        `}</style>
      )}
      <main
        className={`${montserrat.variable} font-mont w-full min-h-screen h-full relative z-0 bg-black`}
      >
        {navMode === "navbar" && <Navbar navMode={navMode} setNavMode={handleSetNavMode} />}
        {navMode === "navbar" && <div className="h-20 lg:h-16" />}
        <LiveChat />
        
        <div className="flex w-full relative">
          {navMode === "sidebar" && (
            <Sidebar 
              isOpen={isSidebarOpen} 
              setIsOpen={setIsSidebarOpen} 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              navMode={navMode}
              setNavMode={handleSetNavMode}
              openTabs={openTabs}
              handleCloseTab={handleCloseTab}
            />
          )}
          
          <div 
            className={`flex-grow w-full relative transition-all duration-300 ease-in-out flex flex-col ${
              navMode === "sidebar"
                ? isSidebarOpen ? "pl-[270px] lg:pl-[50px]" : "pl-[50px]"
                : "pl-0"
            }`}
            style={{ minHeight: navMode === "navbar" ? 'calc(100vh - 5rem)' : '100vh' }}
          >
            {navMode === "sidebar" && (
              <>
                <div
                  className="fixed top-0 z-30 flex bg-transparent overflow-x-auto select-none h-9 text-xs font-sans text-zinc-400 transition-all duration-300 ease-in-out"
                  style={{
                    left: isSidebarOpen ? '270px' : '50px',
                    right: 0,
                  }}
                >
                  <style jsx>{`
                    div::-webkit-scrollbar {
                      height: 2px;
                    }
                    div::-webkit-scrollbar-track {
                      background: transparent;
                    }
                    div::-webkit-scrollbar-thumb {
                      background: rgba(255, 255, 255, 0.15);
                    }
                  `}</style>
                  {openTabs.map((tabName) => {
                    const fileInfo = pageFiles.find(f => f.name === tabName);
                    if (!fileInfo) return null;
                    const isActive = pathToFileMap[router.pathname] === tabName;
                    const Icon = fileInfo.icon;
                    return (
                      <div
                        key={tabName}
                        onClick={() => router.push(fileInfo.path)}
                        className={`flex items-center gap-2 px-4 h-full cursor-pointer transition-colors relative group min-w-[120px] max-w-[160px] ${
                          isActive 
                            ? "bg-white/5 text-white border-t-[2px] border-t-blue-500 font-medium" 
                            : "hover:bg-white/5 hover:text-zinc-200"
                        }`}
                      >
                        <Icon size={14} className={fileInfo.color} />
                        <span className="truncate flex-1">{tabName}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCloseTab(tabName);
                          }}
                          className="text-zinc-500 hover:text-zinc-200 hover:bg-white/10 rounded p-0.5 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity ml-1.5 flex items-center justify-center"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    );
                  })}
                </div>
                {/* Spacer to push content below fixed tab bar */}
                <div className="h-9 shrink-0" />
              </>
            )}
            <div className="flex-grow">
              <AnimatePresence initial={false} mode="wait">
                <Component key={router.asPath} {...pageProps} isAppLoading={loading} />
              </AnimatePresence>
            </div>
            <Footer />
          </div>
        </div>
      </main>
    </>
  );
}
