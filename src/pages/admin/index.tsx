import Head from "next/head";
import { useState, FormEvent } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, ArrowRight, ShieldAlert } from "lucide-react";

export default function AdminLogin() {
  const [accessCode, setAccessCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!accessCode.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to authenticate");
      }

      // Successful login
      router.push("/admin/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid Access Code");
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Admin Portal | Access</title>
        <meta name="robots" content="noindex, nofollow" />
        <link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Bebas+Neue&display=swap" rel="stylesheet" />
      </Head>

      <main className="flex min-h-screen w-full items-center justify-center bg-black text-light grain-bg px-4 relative overflow-hidden">
        {/* Background Decorative Rings */}
        <div className="absolute w-[500px] h-[500px] rounded-full bg-yellow-400/5 blur-[120px] top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute w-[400px] h-[400px] rounded-full bg-primary/5 blur-[100px] bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md bg-white/3 border border-light/10 backdrop-blur-md rounded-2xl p-8 sm:p-6 shadow-2xl relative z-10 hover:border-yellow-400/20 transition-colors duration-500"
        >
          {/* Header */}
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="w-12 h-12 rounded-xl bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-yellow-400 mb-4 shadow-lg shadow-yellow-400/5">
              <Lock size={20} />
            </div>
            <h1 className="font-['Bebas_Neue'] text-4xl tracking-wider text-light mb-1 uppercase">
              Admin Portal
            </h1>
            <p className="font-['Share_Tech_Mono'] text-xs uppercase tracking-widest text-light/40">
              Enter Access Code
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="font-['Share_Tech_Mono'] text-2xs uppercase tracking-wider text-light/60 block">
                Secure Key Node
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="••••••••"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  disabled={isLoading}
                  required
                  className="w-full bg-dark/60 border border-light/10 rounded-xl px-4 py-3 text-light placeholder:text-light/20 focus:border-yellow-400/40 focus:outline-none transition-colors font-sans text-center tracking-widest"
                />
              </div>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 text-red-400 border border-red-500/20 bg-red-500/5 p-3.5 rounded-xl text-xs font-semibold"
                >
                  <ShieldAlert size={14} className="flex-shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading || !accessCode}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 bg-yellow-400 text-dark font-['Share_Tech_Mono'] font-bold py-3 px-6 rounded-xl hover:bg-yellow-300 transition-colors uppercase tracking-wider disabled:opacity-40 disabled:hover:scale-100 disabled:bg-yellow-400 text-sm shadow-xl shadow-yellow-400/10"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-dark" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Authorizing...
                </span>
              ) : (
                <>
                  Connect Portal <ArrowRight size={15} />
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </main>
    </>
  );
}

export async function getServerSideProps(context: any) {
  const { verifySession } = await import("@/lib/adminAuth");
  const isValid = await verifySession(context.req);

  if (isValid) {
    return {
      redirect: {
        destination: "/admin/dashboard",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
