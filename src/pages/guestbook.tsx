import Layout from "@/components/Layout";
import Head from "next/head";
import AnimatedText from "@/components/AnimatedText";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import {
  MessageSquare, Send, ThumbsUp, Heart,
  LogOut, Sparkles, Reply, X
} from "lucide-react";
import Image from "next/image";
import { db, auth, googleProvider, githubProvider } from "@/lib/firebase";
import {
  collection, addDoc, onSnapshot, doc, updateDoc,
  serverTimestamp, query, orderBy
} from "firebase/firestore";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

const AUTHOR_EMAIL = "yoeljwk7@gmail.com";
const EMOJIS = ["👍", "❤️"];

const EmojiIcon = ({ emoji }) => {
  const icons = { "👍": ThumbsUp, "❤️": Heart };
  const Icon = icons[emoji];
  return Icon ? <Icon size={13} className="mr-1 inline flex-shrink-0" /> : null;
};

const formatDate = (timestamp) => {
  if (!timestamp) return "…";
  try {
    const date = typeof timestamp.toDate === "function" ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) +
      " · " + date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  } catch { return "…"; }
};

export default function Guestbook() {
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [inputText, setInputText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null); // { id, userName, text }
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [hoveredMsg, setHoveredMsg] = useState(null);
  const [loginNotif, setLoginNotif] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    setMounted(true);
    const unsubAuth = onAuthStateChanged(auth, (user) => setCurrentUser(user));
    const q = query(collection(db, "guestbook"), orderBy("createdAt", "asc"));
    const unsubMsgs = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      if (isFirstLoad.current) {
        isFirstLoad.current = false;
        return;
      }
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    });
    return () => { unsubAuth(); unsubMsgs(); };
  }, []);

  const handleSignIn = async (provider) => {
    try {
      await signInWithPopup(auth, provider === "google" ? googleProvider : githubProvider);
    } catch (err) { console.error(err); }
  };

  const handleSignOut = () => signOut(auth);

  const handleReply = (msg) => {
    if (!currentUser) { setLoginNotif(true); setTimeout(() => setLoginNotif(false), 3000); return; }
    setReplyingTo({ id: msg.id, userName: msg.userName, text: msg.text });
    inputRef.current?.focus();
  };

  const handleReactionClick = (msgId, emoji) => {
    if (!currentUser) { setLoginNotif(true); setTimeout(() => setLoginNotif(false), 3000); return; }
    handleToggleReaction(msgId, emoji);
  };

  const handlePostMessage = async (e) => {
    e.preventDefault();
    if (!currentUser || !inputText.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "guestbook"), {
        text: inputText.trim(),
        createdAt: serverTimestamp(),
        userId: currentUser.uid,
        userName: currentUser.displayName,
        userPhoto: currentUser.photoURL,
        userEmail: currentUser.email,
        reactions: { "👍": [], "❤️": [] },
        replyTo: replyingTo ?? null,
      });
      setInputText("");
      setReplyingTo(null);
    } catch (err) { console.error(err); }
    setIsSubmitting(false);
  };

  const handleToggleReaction = async (msgId, emoji) => {
    if (!currentUser) return;
    const msg = messages.find(m => m.id === msgId);
    const existing = msg.reactions?.[emoji] || [];
    const toggled = existing.includes(currentUser.uid)
      ? existing.filter(id => id !== currentUser.uid)
      : [...existing, currentUser.uid];
    await updateDoc(doc(db, "guestbook", msgId), { [`reactions.${emoji}`]: toggled });
  };

  const Avatar = ({ src, alt }) => (
    <div className="relative w-8 h-8 rounded-full overflow-hidden border border-light/20 flex-shrink-0 mt-5">
      {mounted && <Image src={src || "https://api.dicebear.com/7.x/adventurer/svg?seed=Anon"} alt={alt} fill className="object-cover" unoptimized />}
    </div>
  );

  return (
    <>
      <Head>
        <title>Guestbook | Yoel Ginting</title>
        <meta name="description" content="Tinggalkan pesan, saran, atau sapaan hangat untuk Yoel Ginting." />
      </Head>

      <main className="flex w-full flex-col items-center justify-center text-light bg-black">
        <Layout className="pt-16">
          <div className="max-w-4xl mx-auto w-full">

            {/* Header */}
            <div className="max-w-2xl mx-auto mb-4">
              <AnimatedText text="Guestbook" className="!text-3xl lg:!text-2xl sm:!text-xl" />
              <p className="text-light/60 text-sm mt-1">
                Tinggalkan pesan, saran, atau sekadar sapaan hangat. Semua pesan tersimpan dan terlihat oleh semua orang!
              </p>
            </div>

            {/* Login Notif Toast */}
            <AnimatePresence>
              {loginNotif && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="max-w-2xl mx-auto mb-2 flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-xs font-semibold px-4 py-2.5 rounded-xl"
                >
                   Masuk terlebih dahulu untuk reply atau memberi reaksi!
                </motion.div>
              )}
            </AnimatePresence>
            <div className="max-w-2xl mx-auto mb-24 border border-light/10 rounded-2xl overflow-hidden bg-white/3 backdrop-blur-md">

              {/* Chat Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-light/10 bg-white/5">
                <div className="flex items-center gap-2">
                  <MessageSquare size={16} className="text-yellow-400" />
                  <span className="font-bold text-sm">Guestbook</span>
                  <span className="text-[10px] bg-yellow-400/20 text-yellow-400 border border-yellow-400/30 px-1.5 py-0.5 rounded-full">{messages.length}</span>
                </div>
                {currentUser && (
                  <div className="flex items-center gap-2">
                    <div className="relative w-6 h-6 rounded-full overflow-hidden border border-light/20">
                      {mounted && <Image src={currentUser.photoURL || "https://api.dicebear.com/7.x/adventurer/svg?seed=Anon"} alt={currentUser.displayName} fill className="object-cover" unoptimized />}
                    </div>
                    <span className="text-xs text-light/60 font-medium">{currentUser.displayName}</span>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-1 text-xs text-light/40 hover:text-red-400 transition-colors border border-light/10 px-2 py-1 rounded-lg hover:border-red-500/20 hover:bg-red-500/5"
                    >
                      <LogOut size={11} /> Keluar
                    </button>
                  </div>
                )}
              </div>

              {/* Messages Area */}
              <div className="h-[480px] overflow-y-auto p-4 space-y-4 guestbook-scroll">
                <AnimatePresence initial={false}>
                  {messages.length > 0 ? messages.map(msg => {
                    const isAuthor = msg.userEmail === AUTHOR_EMAIL;
                    const reactedByUser = emoji => currentUser && (msg.reactions?.[emoji] || []).includes(currentUser.uid);

                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className={`flex gap-2 items-start ${isAuthor ? "justify-end" : "justify-start"}`}
                        onMouseEnter={() => setHoveredMsg(msg.id)}
                        onMouseLeave={() => setHoveredMsg(null)}
                      >
                        {!isAuthor && <Avatar src={msg.userPhoto} alt={msg.userName} />}

                        <div className={`flex flex-col max-w-[75%] ${isAuthor ? "items-end" : "items-start"}`}>
                          {/* Nama + label + waktu */}
                          <div className={`flex items-center gap-1.5 mb-1 ${isAuthor ? "flex-row-reverse" : "flex-row"}`}>
                            <span className="text-[11px] font-bold text-light/70">{msg.userName}</span>
                            {isAuthor && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-yellow-400/20 border border-yellow-400/40 text-yellow-400">Author</span>
                            )}
                            <span className="text-[9px] text-light/35">{formatDate(msg.createdAt)}</span>
                          </div>

                          {/* Bubble + reply icon */}
                          <div className={`flex items-center gap-2 ${isAuthor ? "flex-row-reverse" : "flex-row"}`}>
                            <div className={`rounded-2xl text-sm leading-relaxed whitespace-pre-wrap transition-colors cursor-default overflow-hidden ${
                              isAuthor
                                ? "bg-yellow-400/20 border border-yellow-400/30 text-light/90 rounded-tr-sm hover:bg-gray-500/30"
                                : "bg-white/10 border border-light/10 text-light/85 rounded-tl-sm"
                            }`}>
                              {/* Quote jika ada replyTo */}
                              {msg.replyTo && (
                                <div className={`px-3 pt-2.5 pb-1.5 border-b ${isAuthor ? "border-yellow-400/20" : "border-light/10"}`}>
                                  <div className={`pl-2 border-l-2 ${isAuthor ? "border-yellow-400/60" : "border-light/40"}`}>
                                    <p className="text-[10px] font-bold text-light/50 mb-0.5">{msg.replyTo.userName}</p>
                                    <p className="text-[11px] text-light/40 truncate max-w-[200px]">{msg.replyTo.text}</p>
                                  </div>
                                </div>
                              )}
                              <p className="px-4 py-2.5">{msg.text}</p>
                            </div>

                            {/* Reply icon on hover */}
                            <AnimatePresence>
                              {hoveredMsg === msg.id && (
                                <motion.button
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.8 }}
                                  transition={{ duration: 0.15 }}
                                  onClick={() => handleReply(msg)}
                                  className="p-1.5 rounded-full bg-dark/60 border border-light/10 text-light/50 hover:text-light hover:border-light/30 transition-colors flex-shrink-0"
                                  title="Balas"
                                >
                                  <Reply size={13} className={isAuthor ? "scale-x-[-1]" : ""} />
                                </motion.button>
                              )}
                            </AnimatePresence>
                          </div>

                          {/* Reactions */}
                          <div className={`flex gap-1 mt-1.5 flex-wrap ${isAuthor ? "justify-end" : "justify-start"}`}>
                            {EMOJIS.map(emoji => {
                              const count = (msg.reactions?.[emoji] || []).length;
                              const active = reactedByUser(emoji);
                              return (
                                <button
                                  key={emoji}
                                  onClick={() => handleReactionClick(msg.id, emoji)}
                                  className={`px-2 py-1 rounded-full border text-[10px] font-semibold flex items-center transition-all ${
                                    active
                                      ? "bg-yellow-400/20 border-yellow-400 text-yellow-300"
                                      : "bg-dark/40 border-light/10 text-light/50 hover:border-light/30"
                                  }`}
                                >
                                  <EmojiIcon emoji={emoji} /><span>{count}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {isAuthor && <Avatar src={msg.userPhoto} alt={msg.userName} />}
                      </motion.div>
                    );
                  }) : (
                    <div className="text-center py-16">
                      <p className="text-light/50">Belum ada pesan di Buku Tamu.</p>
                      <p className="text-xs text-light/35 mt-1">Jadilah yang pertama untuk menyapa Yoel!</p>
                    </div>
                  )}
                </AnimatePresence>
                <div ref={bottomRef} />
              </div>

              {/* Input Area */}
              <div className="border-t border-light/10 bg-white/5">
                {!currentUser ? (
                  <div className="p-4">
                    <p className="text-center text-light/50 text-xs mb-3 flex items-center justify-center gap-1">
                      Masuk untuk meninggalkan pesan
                    </p>
                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={() => handleSignIn("google")}
                        className="flex items-center gap-2 px-4 py-2 border border-light/20 rounded-xl text-xs font-semibold hover:border-light/40 hover:bg-light/5 transition-all"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                        </svg>
                        Google
                      </button>
                      <button
                        onClick={() => handleSignIn("github")}
                        className="flex items-center gap-2 px-4 py-2 border border-light/20 rounded-xl text-xs font-semibold hover:border-light/40 hover:bg-light/5 transition-all"
                      >
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                        </svg>
                        GitHub
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    {/* Reply preview tag */}
                    <AnimatePresence>
                      {replyingTo && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex items-center justify-between px-3 pt-2.5 pb-1"
                        >
                          <div className="flex items-center gap-2 border-l-2 border-yellow-400/60 pl-2 flex-1 min-w-0">
                            <div>
                              <p className="text-[10px] font-bold text-yellow-400">{replyingTo.userName}</p>
                              <p className="text-[11px] text-light/40 truncate max-w-[300px]">{replyingTo.text}</p>
                            </div>
                          </div>
                          <button onClick={() => setReplyingTo(null)} className="text-light/30 hover:text-light/70 transition-colors ml-2 flex-shrink-0">
                            <X size={14} />
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Input */}
                    <form onSubmit={handlePostMessage} className="flex gap-2 items-end p-3">
                      <div className="relative w-7 h-7 rounded-full overflow-hidden border border-light/20 flex-shrink-0 mb-1">
                        {mounted && <Image src={currentUser.photoURL || "https://api.dicebear.com/7.x/adventurer/svg?seed=Anon"} alt={currentUser.displayName} fill className="object-cover" unoptimized />}
                      </div>
                      <textarea
                        ref={inputRef}
                        required value={inputText}
                        onChange={e => setInputText(e.target.value)}
                        onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handlePostMessage(e); } }}
                        placeholder={replyingTo ? `Balas ${replyingTo.userName}…` : "Tulis pesan… (Enter untuk kirim)"}
                        maxLength={500} rows={1}
                        className="flex-1 bg-dark/60 border border-light/10 rounded-xl px-3 py-2 text-light placeholder:text-light/40 focus:border-light/40 focus:outline-none transition-colors text-sm resize-none"
                      />
                      <button
                        type="submit" disabled={!inputText.trim() || isSubmitting}
                        className="flex items-center justify-center bg-yellow-400 text-dark p-2 rounded-xl hover:bg-yellow-300 transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 mb-1 flex-shrink-0"
                      >
                        <Send size={15} />
                      </button>
                    </form>
                  </div>
                )}
              </div>

            </div>
          </div>
        </Layout>
      </main>
    </>
  );
}
