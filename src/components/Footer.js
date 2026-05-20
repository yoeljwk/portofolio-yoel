import Link from "next/link";
import React, { useState } from "react";
import { Github, Linkedin, Instagram } from "lucide-react";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    console.log("Subscribe:", email);
    setEmail("");
  };

  return (
    <footer className="w-full max-w-full overflow-x-hidden bg-black text-gray-300 border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-6 py-12 sm:px-4">
        <div className="grid grid-cols-4 gap-8 lg:grid-cols-2 md:grid-cols-1 md:gap-6">
          {/* About Us */}
          <div>
            <h3 className="text-light font-semibold text-sm mb-2">
              About Us
            </h3>
            <p className="text-sm leading-relaxed">
              A portfolio by Yoel Ginting showcasing projects and skills.
            </p>
          </div>
          {/* General */}
          <div>
            <h3 className="text-light font-semibold text-sm mb-2">
              General
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm hover:text-purple-400 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm hover:text-purple-400 transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="text-sm hover:text-purple-400 transition-colors"
                >
                  Projects
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-light font-semibold text-sm mb-2">
              Connect
            </h3>
            <div className="flex gap-4 mb-4">
              <a
                href="https://github.com/yoelgntng18"
                className="hover:text-purple-400 transition-colors"
              >
                <Github size={20} />
              </a>
              <a
                href="https://www.linkedin.com/in/yoel-ginting-9912462ab/"
                className="hover:text-purple-400 transition-colors"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="https://www.instagram.com/yoelgntng/"
                className="hover:text-purple-400 transition-colors"
              >
                <Instagram size={20} />
              </a>
            </div>
            <p className="text-sm mb-3">Subscribe to our newsletter</p>
            <form
              onSubmit={handleSubscribe}
              className="flex flex-row gap-2 sm:flex-col"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 px-3 py-2 text-sm bg-transparent border border-gray-600 rounded-full focus:outline-none focus:border-cyan-400 sm:w-full"
              />
              <button
                type="submit"
                className="px-4 py-2 text-sm bg-dark text-white rounded-full hover:bg-red-500 transition-colors whitespace-nowrap sm:w-full"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <div className="mt-12 pt-6 flex flex-col items-center">
          <div className="relative w-64 mb-4">
            <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
          </div>
          <p className="text-sm">© 2026 Yoel Ginting.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
