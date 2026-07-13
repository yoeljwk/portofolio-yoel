import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Files, Search, Menu,
  ChevronRight, ChevronDown, Folder, FolderOpen,
  FileCode2, FileText, Braces, Terminal, X
} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReact, faInstagram, faLinkedinIn, faGithub } from "@fortawesome/free-brands-svg-icons";

const TsxIcon = ({ size, className }: { size?: number; className?: string }) => (
  <FontAwesomeIcon
    icon={faReact}
    style={{ width: size || 14, height: size || 14 }}
    className={className}
  />
);

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  activeTab: string | null;
  setActiveTab: (tab: string | null) => void;
  navMode: "sidebar" | "navbar";
  setNavMode: (mode: "sidebar" | "navbar") => void;
  openTabs: string[];
  handleCloseTab: (filename: string) => void;
}

export default function Sidebar({
  isOpen, setIsOpen, activeTab, setActiveTab, navMode, setNavMode, openTabs, handleCloseTab
}: SidebarProps) {
  const router = useRouter();
  const currentPath = router.pathname;

  const [isPagesExpanded, setIsPagesExpanded] = useState(true);
  const [isStylesExpanded, setIsStylesExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [openModalFile, setOpenModalFile] = useState<string | null>(null);

  const pageFiles = [
    { name: "index.tsx", path: "/", label: "Home", icon: TsxIcon, color: "text-blue-400" },
    { name: "about.tsx", path: "/about", label: "About Me", icon: TsxIcon, color: "text-cyan-400" },
    { name: "projects.tsx", path: "/projects", label: "Projects", icon: TsxIcon, color: "text-cyan-400" },
    { name: "blog.tsx", path: "/blog", label: "Blog", icon: TsxIcon, color: "text-cyan-400" },
    { name: "guestbook.tsx", path: "/guestbook", label: "Guestbook", icon: TsxIcon, color: "text-cyan-400" },
  ];

  const componentFiles = [
    { name: "Navbar.tsx", content: `// Navbar.tsx\nimport Link from "next/link";\nexport default function Navbar() {\n  return (\n    <header className="fixed top-0 z-40 bg-transparent px-32">\n      <nav className="bg-dark/90 shadow-lg border border-light">\n        <CustomLink href="/" title="Home" />\n        <CustomLink href="/about" title="About" />\n        <CustomLink href="/projects" title="Projects" />\n      </nav>\n    </header>\n  );\n}` },
    { name: "LiveChat.tsx", content: `// LiveChat.tsx\nexport default function LiveChat() {\n  return (\n    <div className="live-chat-panel border border-neutral-800 bg-black/95">\n      <h3>Live Guestbook Chat</h3>\n    </div>\n  );\n}` },
    { name: "FloatingBackground.tsx", content: `// FloatingBackground.tsx\nexport default function FloatingBackground() {\n  return (\n    <div className="pointer-events-none fixed inset-0 -z-10 bg-black overflow-hidden">\n    </div>\n  );\n}` },
    { name: "Sidebar.tsx", content: `// Sidebar.tsx\nexport default function Sidebar() {\n  return (\n    <div className="flex h-screen bg-[#1e1e1e] text-[#cccccc] font-sans">\n    </div>\n  );\n}` }
  ];

  const styleFiles = [
    { name: "globals.css", content: `/* globals.css */\n@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\nhtml, body {\n  overflow-x: hidden;\n  background-color: black;\n  color: #f5f5f5;\n}\n\n* {\n  box-sizing: border-box;\n}` }
  ];

  const rootFiles = [
    {
      name: "package.json",
      icon: Braces,
      color: "text-yellow-500",
      content: `{\n  "name": "yoel-portfolio",\n  "version": "1.0.0",\n  "dependencies": {\n    "next": "^14.2.7",\n    "react": "18.3.1",\n    "framer-motion": "^11.3.31",\n    "lucide-react": "^0.563.0",\n    "tailwindcss": "^3.4.10"\n  },\n  "devDependencies": {\n    "typescript": "^5.5.4"\n  }\n}`
    },
    {
      name: "tailwind.config.js",
      icon: Terminal,
      color: "text-sky-400",
      content: `// tailwind.config.js\nmodule.exports = {\n  content: ["./src/**/*.{js,ts,jsx,tsx}"],\n  theme: {\n    extend: {\n      colors: {\n        dark: "#1b1b1b",\n        light: "#f5f5f5",\n        primary: "#2545d0"\n      }\n    }\n  }\n};`
    }
  ];

  const activePageFile = pageFiles.find(file => file.path === currentPath) || pageFiles[0];

  const handleTabClick = (tab: string) => {
    if (activeTab === tab) {
      setIsOpen(false);
      setActiveTab(null);
    } else {
      setActiveTab(tab);
      setIsOpen(true);
    }
  };

  const searchDb = [
    { file: "about.tsx", line: 136, text: "Get to know me (Biography)" },
    { file: "about.tsx", line: 272, text: "<Skills /> & <Experience />" },
    { file: "projects.tsx", line: 12, text: "Showcasing creative web development projects" },
    { file: "blog.tsx", line: 55, text: "Latest tech articles and web developer tips" },
    { file: "guestbook.tsx", line: 89, text: "Leave a sign-in message in the Live Guestbook!" },
    { file: "index.tsx", line: 37, text: "When the code works, dreams move forward." }
  ];

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }
    const query = searchQuery.toLowerCase();
    const matches = searchDb.filter(
      item => item.text.toLowerCase().includes(query) || item.file.toLowerCase().includes(query)
    );
    setSearchResults(matches);
  }, [searchQuery]);

  const getFileContent = (filename: string): string => {
    const componentFile = componentFiles.find(f => f.name === filename);
    if (componentFile) return componentFile.content;

    const styleFile = styleFiles.find(f => f.name === filename);
    if (styleFile) return styleFile.content;

    const rootFile = rootFiles.find(f => f.name === filename);
    if (rootFile) return rootFile.content;

    return `// ${filename}\n// Code preview not available.`;
  };

  return (
    <>
      <div
        className="fixed left-0 bottom-0 top-0 z-50 flex text-[#cccccc] font-sans select-none"
        style={{ height: '100vh' }}
      >
        <div className="w-[50px] bg-transparent flex flex-col justify-between items-center">
          <div className="flex flex-col gap-2 w-full items-center">
            <button
              onClick={() => handleTabClick("explorer")}
              title="Explorer"
              className={`relative group p-2 rounded transition-colors ${isOpen && activeTab === "explorer" ? "text-white" : "text-zinc-500 hover:text-zinc-300"}`}
            >
              {isOpen && activeTab === "explorer" && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-6 bg-blue-500" />
              )}
              <Files size={22} className="stroke-[1.5]" />
            </button>

            <button
              onClick={() => handleTabClick("search")}
              title="Search"
              className={`relative group p-2 rounded transition-colors ${isOpen && activeTab === "search" ? "text-white" : "text-zinc-500 hover:text-zinc-300"}`}
            >
              {isOpen && activeTab === "search" && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-6 bg-blue-500" />
              )}
              <Search size={22} className="stroke-[1.5]" />
            </button>

            <div className="w-full border-t border-white/5 my-1" />

            <a
              href="https://instagram.com/yoelgntng"
              target="_blank"
              rel="noopener noreferrer"
              title="Instagram"
              className="p-2 rounded transition-colors text-zinc-500 hover:text-pink-400"
            >
              <FontAwesomeIcon icon={faInstagram} style={{ width: 20, height: 20 }} />
            </a>

            <a
              href="https://www.linkedin.com/in/yoel-ginting-9912462ab/"
              target="_blank"
              rel="noopener noreferrer"
              title="LinkedIn"
              className="p-2 rounded transition-colors text-zinc-500 hover:text-sky-400"
            >
              <FontAwesomeIcon icon={faLinkedinIn} style={{ width: 20, height: 20 }} />
            </a>

            <a
              href="https://github.com/yoeljwk"
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub"
              className="p-2 rounded transition-colors text-zinc-500 hover:text-white"
            >
              <FontAwesomeIcon icon={faGithub} style={{ width: 20, height: 20 }} />
            </a>

            <button
              onClick={() => setNavMode("navbar")}
              title="Switch to Classic Navbar Mode"
              className="relative group p-2 rounded transition-colors text-zinc-500 hover:text-zinc-300 mt-2"
            >
              <Menu size={22} className="stroke-[1.5]" />
            </button>
          </div>
        </div>

        <div
          className={`bg-transparent overflow-hidden transition-all duration-300 ease-in-out flex flex-col h-full
            ${isOpen ? "w-[220px] opacity-100" : "w-0 opacity-0"}`}
        >
          {activeTab === "explorer" && (
            <div className="flex flex-col h-full text-[13px] font-sans">
              <div className="px-4 py-2.5 flex items-center justify-between text-[11px] font-bold text-[#bbbbbb] tracking-wider uppercase">
                <span>Explorer: Yoel-Portfolio</span>
                <span className="text-zinc-500 cursor-pointer hover:text-zinc-300 font-bold">...</span>
              </div>

              <div className="flex flex-col">
                <div className="px-2 py-1.5 bg-transparent hover:bg-white/5 flex items-center gap-1 cursor-pointer font-semibold text-[11px] text-[#bbbbbb]">
                  <ChevronDown size={14} className="text-zinc-400" />
                  <span>OPEN EDITORS</span>
                </div>
                {openTabs.map((tabName) => {
                  const fileInfo = pageFiles.find(f => f.name === tabName);
                  if (!fileInfo) return null;
                  const isActive = currentPath === fileInfo.path;
                  return (
                    <div
                      key={tabName}
                      onClick={() => router.push(fileInfo.path)}
                      className={`flex items-center justify-between px-6 py-1 hover:bg-white/5 cursor-pointer text-[13px] group ${isActive ? "bg-white/10 text-white font-medium" : "text-[#cccccc]"}`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <fileInfo.icon size={14} className={`${fileInfo.color} shrink-0`} />
                        <span className="truncate">{tabName}</span>
                      </div>
                      <X
                        size={12}
                        className="text-zinc-500 hover:text-zinc-200 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCloseTab(tabName);
                        }}
                      />
                    </div>
                  );
                })}
              </div>

              <div className="flex-1 overflow-y-auto pt-2">
                <div className="px-2 py-1.5 flex items-center gap-1 cursor-pointer font-bold text-[11px] text-[#bbbbbb]">
                  <ChevronDown size={14} />
                  <span className="tracking-wide">YOEL-PORTFOLIO</span>
                </div>

                <div className="pl-4">
                  <div className="flex items-center gap-1.5 py-1 px-2 hover:bg-white/5 cursor-pointer text-[#dddddd]">
                    <ChevronDown size={14} className="text-zinc-400" />
                    <FolderOpen size={14} className="text-amber-500 fill-amber-500/20" />
                    <span>src</span>
                  </div>

                  <div className="pl-4">
                    <button
                      onClick={() => setIsPagesExpanded(!isPagesExpanded)}
                      className="w-full flex items-center gap-1.5 py-1 px-2 hover:bg-white/5 text-left text-[#dddddd]"
                    >
                      {isPagesExpanded ? <ChevronDown size={14} className="text-zinc-400" /> : <ChevronRight size={14} className="text-zinc-400" />}
                      {isPagesExpanded ? <FolderOpen size={14} className="text-amber-500 fill-amber-500/20" /> : <Folder size={14} className="text-amber-500 fill-amber-500/20" />}
                      <span>pages</span>
                    </button>

                    {isPagesExpanded && (
                      <div className="pl-4">
                        {pageFiles.map((file) => {
                          const isActive = currentPath === file.path;
                          return (
                            <button
                              key={file.name}
                              onClick={() => router.push(file.path)}
                              className={`w-full flex items-center gap-2 py-1.5 px-3 hover:bg-white/5 text-left text-[13px] ${isActive ? "bg-white/10 text-white font-medium border-l-2 border-blue-500" : "text-[#cccccc]"}`}
                            >
                              <file.icon size={14} className={`${file.color}`} />
                              <span>{file.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="pl-4">
                    <div className="w-full flex items-center gap-1.5 py-1 px-2 text-left text-zinc-500 cursor-default select-none">
                      <ChevronRight size={14} className="text-zinc-600" />
                      <Folder size={14} className="text-sky-500/50 fill-sky-500/10" />
                      <span>components</span>
                    </div>
                  </div>

                  <div className="pl-4">
                    <button
                      onClick={() => setIsStylesExpanded(!isStylesExpanded)}
                      className="w-full flex items-center gap-1.5 py-1 px-2 hover:bg-white/5 text-left text-[#dddddd]"
                    >
                      {isStylesExpanded ? <ChevronDown size={14} className="text-zinc-400" /> : <ChevronRight size={14} className="text-zinc-400" />}
                      {isStylesExpanded ? <FolderOpen size={14} className="text-emerald-500 fill-emerald-500/20" /> : <Folder size={14} className="text-emerald-500 fill-emerald-500/20" />}
                      <span>styles</span>
                    </button>

                    {isStylesExpanded && (
                      <div className="pl-4">
                        {styleFiles.map((file) => (
                          <div
                            key={file.name}
                            className="w-full flex items-center gap-2 py-1.5 px-3 text-left text-[13px] text-zinc-500 cursor-default"
                          >
                            <FileText size={14} className="text-zinc-600" />
                            <span>{file.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pl-4 pt-1">
                  {rootFiles.map((file) => (
                    <div
                      key={file.name}
                      className="w-full flex items-center gap-2 py-1 px-2 text-left text-zinc-500 cursor-default"
                    >
                      <div className="w-[14px]" />
                      <file.icon size={14} className="text-zinc-600" />
                      <span>{file.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "search" && (
            <div className="p-4 flex flex-col h-full font-sans text-xs pt-4">
              <span className="text-[#bbbbbb] font-bold uppercase tracking-wider mb-2.5">Search</span>
              <div className="relative mb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search keywords..."
                  className="w-full bg-[#3c3c3c] text-white border border-[#555] rounded px-2.5 py-1.5 outline-none focus:border-blue-500 text-xs"
                />
                {searchQuery && (
                  <button className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white" onClick={() => setSearchQuery("")}>
                    <X size={12} />
                  </button>
                )}
              </div>

              <div className="flex-grow overflow-y-auto">
                {searchResults.length > 0 ? (
                  <div className="flex flex-col gap-2.5">
                    <span className="text-[#888888] font-semibold">{searchResults.length} results found</span>
                    {searchResults.map((res, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          const page = pageFiles.find(p => p.name === res.file);
                          if (page) router.push(page.path);
                          else setOpenModalFile(res.file);
                        }}
                        className="p-2 bg-[#2d2d2d]/60 rounded hover:bg-[#2d2d2d] cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-1.5 text-blue-400 font-bold mb-0.5">
                          <FileCode2 size={12} />
                          <span>{res.file}</span>
                          <span className="text-zinc-500 text-[10px] font-normal">Line {res.line}</span>
                        </div>
                        <p className="text-[#cccccc] text-[11px] italic">"{res.text}"</p>
                      </div>
                    ))}
                  </div>
                ) : searchQuery ? (
                  <span className="text-zinc-500">No results found for "{searchQuery}"</span>
                ) : (
                  <div className="text-zinc-500 flex flex-col gap-1.5 leading-relaxed">
                    <span>Try searching for:</span>
                    <button onClick={() => setSearchQuery("biography")} className="text-blue-400 hover:underline text-left">· biography</button>
                    <button onClick={() => setSearchQuery("projects")} className="text-blue-400 hover:underline text-left">· projects</button>
                    <button onClick={() => setSearchQuery("guestbook")} className="text-blue-400 hover:underline text-left">· guestbook</button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 backdrop-blur-[1px] hidden lg:block"
          style={{ top: '0px', left: '50px' }}
          onClick={() => {
            setIsOpen(false);
            setActiveTab(null);
          }}
        />
      )}

      {openModalFile && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-[#1e1e1e] border border-[#333333] rounded-lg shadow-2xl overflow-hidden flex flex-col font-mono text-[13px] md:text-xs">
            <div className="bg-[#2d2d2d] px-4 py-3 flex items-center justify-between border-b border-[#333333] text-sm text-[#cccccc]">
              <div className="flex items-center gap-2">
                <FileCode2 size={16} className="text-cyan-400" />
                <span>{openModalFile}</span>
              </div>
              <button
                onClick={() => setOpenModalFile(null)}
                className="text-zinc-500 hover:text-white transition-colors p-1 rounded"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 flex overflow-hidden min-h-[300px] max-h-[500px]">
              <div className="bg-[#1e1e1e] text-[#858585] text-right py-4 px-3 select-none border-r border-[#333333] text-xs">
                {getFileContent(openModalFile).split('\n').map((_, index) => (
                  <div key={index} className="h-5 leading-5">{index + 1}</div>
                ))}
              </div>

              <div className="flex-grow p-4 overflow-y-auto text-[#d4d4d4] bg-[#1e1e1e] select-text">
                <pre className="whitespace-pre">{getFileContent(openModalFile)}</pre>
              </div>
            </div>

            <div className="bg-[#007acc] text-white px-4 py-1.5 flex justify-between text-[11px]">
              <div className="flex items-center gap-2">
                <span className="font-bold uppercase">Ready</span>
                <span>•</span>
                <span>UTF-8</span>
              </div>
              <div>
                <span>TypeScript JSX</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
