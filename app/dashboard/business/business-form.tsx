"use client";

import { createClient } from "@/lib/supabase/client";
import { generateSlug } from "@/src/lib/slug";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { uploadImage } from "@/lib/upload";

type Business = {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  industry: string;
  description: string | null;
  city: string | null;
  province: string | null;
  address: string | null;
  opening_hours: string | null;
  logo_url: string | null;
  cover_url: string | null;
  is_active: boolean;
};

type BusinessFormProps = {
  userId: string;
  business: Business | null;
};

const industries = [
  "Restaurant / Food",
  "Resort / Hotel",
  "Salon / Spa",
  "Retail Shop",
  "Freelancer",
  "Professional Services",
  "Events",
  "Clinic",
  "Other",
];


const provinces = [
  "Oriental Mindoro",
  "Occidental Mindoro",
];

const citiesByProvince = {
  "Oriental Mindoro": [
    "Baco","Bansud","Bongabong","Bulalacao","Calapan","Gloria","Mansalay",
    "Naujan","Pinamalayan","Pola","Puerto Galera","Roxas","San Teodoro",
    "Socorro","Victoria",
  ],
  "Occidental Mindoro": [
    "Abra de Ilog","Calintaan","Looc","Lubang","Magsaysay","Mamburao",
    "Paluan","Rizal","Sablayan","San Jose","Santa Cruz",
  ],
} as const;


const reservedSlugs = [
  "dashboard",
  "login",
  "register",
  "admin",
  "api",
  "pricing",
  "settings",
  "account",
  "business",
  "items",
  "categories",
  "links",
  "appearance",
];

export function BusinessForm({ userId, business }: BusinessFormProps) {
  const router = useRouter();
  const supabase = createClient();
const [logoUrl, setLogoUrl] = useState(business?.logo_url || "");
const [coverUrl, setCoverUrl] = useState(business?.cover_url || "");
const [uploadingLogo, setUploadingLogo] = useState(false);
const [uploadingCover, setUploadingCover] = useState(false);
  const [name, setName] = useState(business?.name || "");
  const [industry, setIndustry] = useState(business?.industry || industries[0]);
  const [description, setDescription] = useState(business?.description || "");
  const [address, setAddress] = useState(business?.address || "");
  const [city, setCity] = useState(business?.city || "");
  const [province, setProvince] = useState(business?.province || "");
  const [openingHours, setOpeningHours] = useState(
    business?.opening_hours || ""
  );
  const [isActive, setIsActive] = useState(business?.is_active ?? true);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const slug = useMemo(() => {
    if (business?.slug) return business.slug;
    return generateSlug(name || "my-business");
  }, [name, business?.slug]);

  async function handleLogoUpload(file: File | null) {
  if (!file) return;

  try {
    setUploadingLogo(true);
    setMessage("");

    const publicUrl = await uploadImage({
      supabase,
      bucket: "business-logos",
      file,
      folder: `${userId}/logos`,
    });

    setLogoUrl(publicUrl);
  } catch (error) {
    setMessage(error instanceof Error ? error.message : "Logo upload failed.");
  } finally {
    setUploadingLogo(false);
  }
}

async function handleCoverUpload(file: File | null) {
  if (!file) return;

  try {
    setUploadingCover(true);
    setMessage("");

    const publicUrl = await uploadImage({
      supabase,
      bucket: "business-covers",
      file,
      folder: `${userId}/covers`,
    });

    setCoverUrl(publicUrl);
  } catch (error) {
    setMessage(error instanceof Error ? error.message : "Cover upload failed.");
  } finally {
    setUploadingCover(false);
  }
}

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    if (!name.trim()) {
      setMessage("Business name is required.");
      setLoading(false);
      return;
    }

    if (!province.trim()) {
      setMessage("Province is required.");
      setLoading(false);
      return;
    }

    if (reservedSlugs.includes(slug)) {
  setMessage("This public slug is reserved. Please use another business name.");
  setLoading(false);
  return;
}

    const payload = {
      owner_id: userId,
      name: name.trim(),
      slug,
      industry,
      description: description.trim() || null,
      address: address.trim() || null,
      city: city.trim() || null,
      province: province.trim() || null,
      opening_hours: openingHours.trim() || null,
logo_url: logoUrl || null,
cover_url: coverUrl || null,
is_active: isActive,
    };

    if (business?.id) {
      const { error } = await supabase
        .from("businesses")
        .update({
          name: payload.name,
          industry: payload.industry,
          description: payload.description,
          address: payload.address,
          city: payload.city,
          province: payload.province,
          opening_hours: payload.opening_hours,
logo_url: payload.logo_url,
cover_url: payload.cover_url,
is_active: payload.is_active,
        })
        .eq("id", business.id)
        .eq("owner_id", userId);

      if (error) {
        setMessage(error.message);
        setLoading(false);
        return;
      }

      setMessage("Business updated successfully.");
    } else {
      const { error } = await supabase.from("businesses").insert(payload);

      if (error) {
        setMessage(error.message);
        setLoading(false);
        return;
      }

      setMessage("Business created successfully.");
    }

    setLoading(false);
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-[#E2D4C2] bg-white/80 p-8 shadow-sm"
    >
      <div className="grid gap-5 md:grid-cols-2">
        <div>
  <label className="text-sm font-medium text-stone-700">
    Business logo
  </label>

  <div className="mt-1 rounded-2xl border border-stone-300 bg-white p-4">
    {logoUrl ? (
      <img
        src={logoUrl}
        alt="Business logo"
        className="mb-3 h-24 w-24 rounded-2xl object-cover"
      />
    ) : (
      <div className="mb-3 flex h-24 w-24 items-center justify-center rounded-2xl bg-[#E9D8C0] text-xs text-[#8A6A4F]">
        No logo
      </div>
    )}

    <label className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-[#C85A32] px-4 py-2 text-sm font-semibold text-white hover:bg-[#A94727]">
  Upload Logo
  <input
    type="file"
    accept="image/jpeg,image/png,image/webp"
    onChange={(event) => handleLogoUpload(event.target.files?.[0] || null)}
    className="hidden"
  />
</label>
    <p className="mt-2 text-xs text-stone-500">
      JPG, PNG, or WebP. Max 5 MB.
    </p>

    {uploadingLogo && (
      <p className="mt-2 text-sm text-[#C85A32]">Uploading logo...</p>
    )}
  </div>
</div>

<div>
  <label className="text-sm font-medium text-stone-700">
    Cover photo
  </label>

  <div className="mt-1 rounded-2xl border border-stone-300 bg-white p-4">
    {coverUrl ? (
      <img
        src={coverUrl}
        alt="Business cover"
        className="mb-3 h-24 w-full rounded-2xl object-cover"
      />
    ) : (
      <div className="mb-3 flex h-24 w-full items-center justify-center rounded-2xl bg-[#E9D8C0] text-xs text-[#8A6A4F]">
        No cover
      </div>
    )}

    <label className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-[#596B3F] px-4 py-2 text-sm font-semibold text-white hover:bg-[#45532F]">
      Upload Cover Photo
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(event) => handleCoverUpload(event.target.files?.[0] || null)}
        className="hidden"
      />
    </label>

    <p className="mt-2 text-xs text-stone-500">
      Best size: wide banner image. JPG, PNG, or WebP. Max 5 MB.
    </p>

    {uploadingCover && (
      <p className="mt-2 text-sm text-[#C85A32]">Uploading cover...</p>
    )}
  </div>
</div>
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-stone-700">
            Business name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-[#C85A32]"
            placeholder="Example: Demo Business"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-stone-700">
            Industry
          </label>
          <select
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 outline-none focus:border-[#C85A32]"
          >
            {industries.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-stone-700">
            Public slug
          </label>
          <input
            value={slug}
            disabled
            className="mt-1 w-full rounded-xl border border-stone-200 bg-stone-100 px-4 py-3 text-stone-500"
          />
          <p className="mt-1 text-xs text-stone-500">
            Your public page will be /{slug}
          </p>
        </div>

        <div className="md:col-span-2">
          <label className="text-sm font-medium text-stone-700">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="mt-1 w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-[#C85A32]"
            placeholder="Tell customers what your business offers."
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-sm font-medium text-stone-700">
            Address
          </label>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="mt-1 w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-[#C85A32]"
            placeholder="Street, barangay, landmark"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-stone-700">
            City / Municipality
          </label>
          <select
    value={city}
    onChange={(e)=>setCity(e.target.value)}
    disabled={!province}
    required
    className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 outline-none focus:border-[#C85A32]"
  >
    <option value="">Select Municipality / City</option>
    {(citiesByProvince[province as keyof typeof citiesByProvince] ?? []).map((item)=>(
      <option key={item} value={item}>{item}</option>
    ))}
  </select>
        </div>

        <div>
          <label className="text-sm font-medium text-stone-700">
            Province
          </label>
          <select
    value={province}
    onChange={(e) => {
      setProvince(e.target.value);
      setCity("");
    }}
    required
    className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 outline-none focus:border-[#C85A32]"
  >
    <option value="">Select Province</option>
    {provinces.map((item) => (
      <option key={item} value={item}>{item}</option>
    ))}
  </select>
        </div>

        <div className="md:col-span-2">
          <label className="text-sm font-medium text-stone-700">
            Opening hours
          </label>
          <input
            value={openingHours}
            onChange={(e) => setOpeningHours(e.target.value)}
            className="mt-1 w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-[#C85A32]"
            placeholder="Open daily, 9:00 AM - 9:00 PM"
          />
        </div>

        <div className="md:col-span-2 flex items-center justify-between rounded-2xl border border-[#E7D8C5] bg-[#FFF8EF] p-4">
          <div>
            <p className="font-semibold text-[#3D2A1E]">Public page status</p>
            <p className="text-sm text-stone-600">
              If active, your business page can be viewed publicly.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsActive((current) => !current)}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              isActive
                ? "bg-[#596B3F] text-white"
                : "bg-stone-200 text-stone-700"
            }`}
          >
            {isActive ? "Active" : "Inactive"}
          </button>
        </div>
      </div>

      {message && (
        <p className="mt-5 rounded-xl bg-[#F1E5D4] px-4 py-3 text-sm text-[#5A3825]">
          {message}
        </p>
      )}

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          disabled={loading}
          className="rounded-2xl bg-[#C85A32] px-6 py-3 font-semibold text-white hover:bg-[#A94727] disabled:opacity-60"
        >
          {loading ? "Saving..." : business ? "Save Changes" : "Create Business"}
        </button>

        {business?.slug && (
          <a
            href={`/${business.slug}`}
            className="rounded-2xl border border-[#BCA892] bg-white px-6 py-3 font-semibold text-[#5A3825] hover:bg-[#FFF8EF]"
          >
            View Public Page
          </a>
        )}
      </div>
    </form>
  );
}