import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageSquare, ExternalLink, ThumbsUp, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";

const AUTHOR_EMAIL = "yoeljwk7@gmail.com";
const EMOJIS = ["👍", "❤️"];

const EmojiIcon = ({ emoji }) => {
  const icons = { "👍": ThumbsUp, "❤️": Heart };
  const Icon = icons[emoji];
  return Icon ? <Icon size={10} className="mr-0.5 inline flex-shrink-0" /> : null;
};

const formatDate = (timestamp) => {
  if (!timestamp) return "…";
  try {
    const date = typeof timestamp.toDate === "function" ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) +
      " · " + date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  } catch { return "…"; }
};

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [mounted, setMounted] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    const q = query(collection(db, "guestbook"), orderBy("createdAt", "asc"), limit(10));
    const unsub = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (isOpen) setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  }, [messages, isOpen]);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 left-6 w-80 sm:w-72 bg-dark/90 backdrop-blur-md border border-light/10 rounded-2xl shadow-2xl z-[60] overflow-hidden"
          >

            <div className="bg-dark px-4 py-3 flex justify-between items-center border-b border-light/10">
              <div className="flex items-center gap-2">
                <h3 className="text-light font-semibold text-sm">Guestbook</h3>
                <span className="text-[10px] bg-white/5 text-light/60 border border-light/10 px-1.5 py-0.5 rounded-full">{messages.length}</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-light/50 hover:text-light hover:bg-white/10 rounded-full p-1 transition-colors">
                <X size={16} />
              </button>
            </div>

            <div className="h-64 p-3 overflow-y-auto space-y-3 bg-black/40 livechat-scroll">
              {messages.length === 0 ? (
                <p className="text-center text-light/40 text-xs mt-8">Belum ada pesan.</p>
              ) : (
                messages.map(msg => {
                  const isAuthor = msg.userEmail === AUTHOR_EMAIL;
                  return (
                    <div key={msg.id} className={`flex gap-2 items-start ${isAuthor ? "justify-end" : "justify-start"}`}>
                      {!isAuthor && (
                        <div className="relative w-6 h-6 rounded-full overflow-hidden border border-light/20 flex-shrink-0 mt-4">
                          {mounted && <Image src={msg.userPhoto || "https://api.dicebear.com/7.x/adventurer/svg?seed=Anon"} alt={msg.userName} fill className="object-cover" unoptimized />}
                        </div>
                      )}
                      <div className={`flex flex-col max-w-[78%] ${isAuthor ? "items-end" : "items-start"}`}>
                        <div className={`flex items-center gap-1 mb-0.5 ${isAuthor ? "flex-row-reverse" : "flex-row"}`}>
                          <span className="text-[10px] font-bold text-light/60 truncate max-w-[100px]">{msg.userName}</span>
                          {isAuthor && <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-white/10 border border-white/10 text-light/50 font-normal">Author</span>}
                          <span className="text-[9px] text-light/30">{formatDate(msg.createdAt)}</span>
                        </div>


                        <div className={`rounded-2xl text-xs leading-relaxed overflow-hidden ${isAuthor
                            ? "bg-white/15 border border-white/10 text-light/95 rounded-tr-sm"
                            : "bg-white/5 border border-white/5 text-light/80 rounded-tl-sm"
                          }`}>
                          {msg.replyTo && (
                            <div className="px-2.5 pt-2 pb-1 border-b border-light/5">
                              <div className="pl-2 border-l-2 border-light/20">
                                <p className="text-[9px] font-bold mb-0.5 text-light/50">{msg.replyTo.userName}</p>
                                <p className="text-[10px] truncate max-w-[160px] text-light/35">{msg.replyTo.text}</p>
                              </div>
                            </div>
                          )}
                          <p className="px-3 py-2">{msg.text.length > 80 ? msg.text.slice(0, 80) + "…" : msg.text}</p>
                        </div>


                        <div className={`flex gap-1 mt-1 flex-wrap ${isAuthor ? "justify-end" : "justify-start"}`}>
                          {EMOJIS.map(emoji => {
                            const count = (msg.reactions?.[emoji] || []).length;
                            if (count === 0) return null;
                            return (
                              <span key={emoji} className="px-1.5 py-0.5 rounded-full border border-light/10 bg-dark/40 text-[9px] text-light/50 flex items-center">
                                <EmojiIcon emoji={emoji} />{count}
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      {isAuthor && (
                        <div className="relative w-6 h-6 rounded-full overflow-hidden border border-light/20 flex-shrink-0 mt-4">
                          {mounted && <Image src={msg.userPhoto || "https://api.dicebear.com/7.x/adventurer/svg?seed=Anon"} alt={msg.userName} fill className="object-cover" unoptimized />}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>


            <div className="p-3 border-t border-light/10 bg-black/20">
              <Link href="/guestbook">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 border border-light/10 text-light font-medium py-2 rounded-xl text-sm transition-all"
                >
                  Tinggalkan Pesan <ExternalLink size={14} />
                </motion.button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      <div className="fixed bottom-6 left-6 z-[60] flex items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-full overflow-hidden shadow-lg"
        >
          <Image src="/images/profile/avayoel.png" alt="Chat" width={56} height={56} className="object-cover" />
        </motion.button>
        <motion.span
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-sm font-semibold text-dark dark:text-light"
        >
          Click me!
        </motion.span>
      </div>
    </>
  );
}
