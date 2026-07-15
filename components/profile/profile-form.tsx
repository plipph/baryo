"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { ProfileAvatar } from "@/components/profile/profile-avatar";
import { createClient } from "@/lib/supabase/client";

type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  city: string | null;
  province: string | null;
  bio: string | null;
};

type ProfileFormProps = {
  profile: Profile;
  variant?: "profile" | "settings";
};

export function ProfileForm({
  profile,
  variant = "profile",
}: ProfileFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const [fullName, setFullName] = useState(profile.full_name || "");
  const [city, setCity] = useState(profile.city || "");
  const [province, setProvince] = useState(profile.province || "");
  const [bio, setBio] = useState(profile.bio || "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const showDetails = variant === "profile";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    const payload = showDetails
      ? {
          full_name: fullName.trim(),
          city: city.trim() || null,
          province: province.trim() || null,
          bio: bio.trim() || null,
        }
      : {
          full_name: fullName.trim(),
        };

    const { error } = await supabase
      .from("profiles")
      .update(payload)
      .eq("id", profile.id);

    if (error) {
      setMessage(error.message);
      setSaving(false);
      return;
    }

    setMessage("Profile updated successfully.");
    setSaving(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="rounded-[2rem] border border-[#E5E7EB] bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <ProfileAvatar
            name={fullName || profile.full_name}
            avatarUrl={profile.avatar_url}
            className="h-20 w-20 text-2xl"
          />
          <div>
            <h2 className="text-xl font-black tracking-tight text-[#111827]">
              Profile photo
            </h2>
            <p className="mt-2 max-w-lg text-sm leading-6 text-stone-600">
              Profile photos will be available when a secure avatar storage bucket is configured. Your initials are shown until then.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-[#E5E7EB] bg-white p-6 shadow-sm">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-stone-700">
              Display Name
            </label>
            <input
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              required
              maxLength={120}
              className="mt-1 min-h-12 w-full rounded-2xl border border-[#E5E7EB] px-4 py-3 outline-none transition focus:border-[#16A34A] focus:ring-4 focus:ring-green-100"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-stone-700">Email</label>
            <input
              value={profile.email || ""}
              readOnly
              className="mt-1 min-h-12 w-full rounded-2xl border border-[#E5E7EB] bg-[#F3F4F6] px-4 py-3 text-stone-500 outline-none"
            />
          </div>

          {showDetails && (
            <>
              <div>
                <label className="text-sm font-medium text-stone-700">City</label>
                <input
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                  maxLength={120}
                  className="mt-1 min-h-12 w-full rounded-2xl border border-[#E5E7EB] px-4 py-3 outline-none transition focus:border-[#16A34A] focus:ring-4 focus:ring-green-100"
                  placeholder="Your city or municipality"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-stone-700">Province</label>
                <input
                  value={province}
                  onChange={(event) => setProvince(event.target.value)}
                  maxLength={120}
                  className="mt-1 min-h-12 w-full rounded-2xl border border-[#E5E7EB] px-4 py-3 outline-none transition focus:border-[#16A34A] focus:ring-4 focus:ring-green-100"
                  placeholder="Your province"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium text-stone-700">Bio</label>
                <textarea
                  value={bio}
                  onChange={(event) => setBio(event.target.value)}
                  maxLength={500}
                  rows={4}
                  className="mt-1 w-full rounded-2xl border border-[#E5E7EB] px-4 py-3 outline-none transition focus:border-[#16A34A] focus:ring-4 focus:ring-green-100"
                  placeholder="Tell the Mindoro community a little about yourself."
                />
              </div>
            </>
          )}
        </div>
      </section>

      {message && (
        <p className="rounded-2xl bg-[#F0FDF4] px-4 py-3 text-sm text-[#14532D]">
          {message}
        </p>
      )}

      <button
        disabled={saving}
        className="rounded-2xl bg-[#14532D] px-6 py-3 font-semibold text-white shadow-[0_16px_32px_-22px_rgba(20,83,45,0.9)] transition hover:bg-[#166534] disabled:opacity-60"
      >
        {saving ? "Saving..." : "Save Profile"}
      </button>
    </form>
  );
}
