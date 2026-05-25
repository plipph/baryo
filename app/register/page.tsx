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

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      const { error: profileError } = await supabase.from("profiles").insert({
        id: data.user.id,
        email,
        full_name: fullName,
        role: "owner",
      });

      if (profileError) {
        setMessage(profileError.message);
        setLoading(false);
        return;
      }
    }

    setLoading(false);
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F1E8] px-6">
      <div className="w-full max-w-md rounded-3xl border border-[#E2D4C2] bg-white/80 p-8 shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#3D2A1E]">
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
              className="mt-1 w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-[#C85A32]"
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
              className="mt-1 w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-[#C85A32]"
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
              className="mt-1 w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-[#C85A32]"
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
            className="w-full rounded-xl bg-[#C85A32] px-4 py-3 font-semibold text-white hover:bg-[#A94727] disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-stone-600">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-[#C85A32]">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}