"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.push("/admin");
      } else {
        const data = await res.json();
        setError(data.error || "Incorrect password");
      }
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "linear-gradient(160deg, #FDF8F0 0%, #F5ECD7 50%, #EDD9B0 100%)" }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl font-light" style={{ color: "#2C1A0E" }}>
            OngLu / Luong
          </h1>
          <p className="mt-2 text-xs uppercase tracking-widest" style={{ color: "#C9A84C", fontFamily: "var(--font-inter)" }}>
            Admin Panel
          </p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border p-8 shadow-sm"
          style={{ background: "#FFFDF8", borderColor: "#E8D5A3" }}>
          <label className="block text-xs uppercase tracking-widest mb-2"
            style={{ color: "#7A5C3A", fontFamily: "var(--font-inter)" }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border outline-none transition-all text-sm"
            style={{
              borderColor: "#E8D5A3",
              fontFamily: "var(--font-inter)",
              color: "#2C1A0E",
              background: "#FDF8F0",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#C9A84C")}
            onBlur={(e) => (e.target.style.borderColor = "#E8D5A3")}
            placeholder="Enter admin password"
            autoFocus
          />

          {error && (
            <p className="mt-3 text-xs text-red-600" style={{ fontFamily: "var(--font-inter)" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="mt-5 w-full py-3 rounded-lg text-sm uppercase tracking-widest transition-opacity disabled:opacity-40"
            style={{
              background: "#C9A84C",
              color: "#FFFDF8",
              fontFamily: "var(--font-inter)",
            }}>
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="text-center mt-6">
          <a href="/" className="text-xs underline transition-opacity hover:opacity-60"
            style={{ color: "#7A5C3A", fontFamily: "var(--font-inter)" }}>
            ← Back to site
          </a>
        </p>
      </div>
    </div>
  );
}
