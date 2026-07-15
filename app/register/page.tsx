"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAF7F2] px-6 py-10">
      <div className="w-full max-w-md rounded-[1.75rem] bg-white p-8 shadow-[0_30px_80px_-45px_rgba(17,24,39,0.7)]">
        <div className="mb-8 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#16A34A]">
            MyNegosyo Mindoro
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-[#111827]">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-stone-600">
            Start building your business page.
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-stone-700">
              Full name
            </label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="mt-1 min-h-12 w-full rounded-2xl border border-[#E5E7EB] px-4 py-3 outline-none transition focus:border-[#16A34A] focus:ring-4 focus:ring-green-100"
              placeholder="Juan Dela Cruz"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-stone-700">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              type="email"
              className="mt-1 min-h-12 w-full rounded-2xl border border-[#E5E7EB] px-4 py-3 outline-none transition focus:border-[#16A34A] focus:ring-4 focus:ring-green-100"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-stone-700">
              Password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              type="password"
              minLength={8}
              className="mt-1 min-h-12 w-full rounded-2xl border border-[#E5E7EB] px-4 py-3 outline-none transition focus:border-[#16A34A] focus:ring-4 focus:ring-green-100"
              placeholder="Minimum 8 characters"
            />
          </div>

          {message && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {message}
            </p>
          )}

          <button
            disabled={loading}
            className="w-full rounded-full bg-[#14532D] px-4 py-3 font-bold text-white shadow-[0_16px_32px_-22px_rgba(20,83,45,0.9)] transition hover:bg-[#166534] disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-stone-600">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-[#14532D]">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}
