export interface MockFile {
  name: string;
  content: string;
}

export const mockComponentFiles: MockFile[] = [
  {
    name: "Navbar.tsx",
    content: `// Navbar.tsx
import Link from "next/link";
export default function Navbar() {
  return (
    <header className="fixed top-0 z-40 bg-transparent px-32">
      <nav className="bg-dark/90 shadow-lg border border-light">
        <CustomLink href="/" title="Home" />
        <CustomLink href="/about" title="About" />
        <CustomLink href="/projects" title="Projects" />
      </nav>
    </header>
  );
}`,
  },
  {
    name: "LiveChat.tsx",
    content: `// LiveChat.tsx
export default function LiveChat() {
  return (
    <div className="live-chat-panel border border-neutral-800 bg-black/95">
      <h3>Live Guestbook Chat</h3>
    </div>
  );
}`,
  },
  {
    name: "FloatingBackground.tsx",
    content: `// FloatingBackground.tsx
export default function FloatingBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 bg-black overflow-hidden">
    </div>
  );
}`,
  },
  {
    name: "Sidebar.tsx",
    content: `// Sidebar.tsx
export default function Sidebar() {
  return (
    <div className="flex h-screen bg-[#1e1e1e] text-[#cccccc] font-sans">
    </div>
  );
}`,
  },
];

export const mockStyleFiles: MockFile[] = [
  {
    name: "globals.css",
    content: `/* globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

html, body {
  overflow-x: hidden;
  background-color: black;
  color: #f5f5f5;
}

* {
  box-sizing: border-box;
}`,
  },
];

export const mockRootFiles = [
  {
    name: "package.json",
    color: "text-yellow-500",
    content: `{
  "name": "yoel-portfolio",
  "version": "1.0.0",
  "dependencies": {
    "next": "^14.2.7",
    "react": "18.3.1",
    "framer-motion": "^11.3.31",
    "lucide-react": "^0.563.0",
    "tailwindcss": "^3.4.10"
  },
  "devDependencies": {
    "typescript": "^5.5.4"
  }
}`,
  },
  {
    name: "tailwind.config.js",
    color: "text-sky-400",
    content: `// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: "#1b1b1b",
        light: "#f5f5f5",
        primary: "#2545d0"
      }
    }
  }
};`,
  },
];
