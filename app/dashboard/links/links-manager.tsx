"use client";

import { createClient } from "@/lib/supabase/client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { LinkIcon } from "@/components/link-icon";
import { link } from "fs/promises";

type BusinessLink = {
  id: string;
  business_id: string;
  type: string;
  label: string;
  url: string;
  icon: string | null;
  sort_order: number;
  is_visible: boolean;
  is_primary: boolean;
};

type LinksManagerProps = {
  businessId: string;
  businessPlan: string;
  initialLinks: BusinessLink[];
};

const linkTypes = [
  {
    value: "facebook",
    label: "Facebook Page",
    placeholder: "https://facebook.com/yourpage",
  },
  {
    value: "messenger",
    label: "Messenger",
    placeholder: "https://m.me/yourpage",
  },
  {
    value: "instagram",
    label: "Instagram",
    placeholder: "https://instagram.com/yourhandle",
  },
  {
    value: "tiktok",
    label: "TikTok",
    placeholder: "https://tiktok.com/@yourhandle",
  },
  {
    value: "youtube",
    label: "YouTube",
    placeholder: "https://youtube.com/@yourchannel",
  },
  {
    value: "whatsapp",
    label: "WhatsApp",
    placeholder: "https://wa.me/639XXXXXXXXX",
  },
  {
    value: "viber",
    label: "Viber",
    placeholder: "viber://chat?number=%2B639XXXXXXXXX",
  },
  {
    value: "phone",
    label: "Phone",
    placeholder: "+639XXXXXXXXX",
  },
  {
    value: "email",
    label: "Email",
    placeholder: "hello@example.com",
  },
  {
    value: "website",
    label: "Website",
    placeholder: "https://yourwebsite.com",
  },
  {
    value: "google_maps",
    label: "Google Maps",
    placeholder: "https://maps.google.com/...",
  },
  {
    value: "waze",
    label: "Waze",
    placeholder: "https://waze.com/ul?...",
  },
  {
    value: "booking",
    label: "Booking Link",
    placeholder: "https://yourbookinglink.com",
  },
  {
    value: "menu",
    label: "Menu Link",
    placeholder: "https://yourmenu.com",
  },
  {
    value: "shop",
    label: "Shop Link",
    placeholder: "https://yourshop.com",
  },
  {
    value: "shopee",
    label: "Shopee",
    placeholder: "https://shopee.ph/yourshop",
  },
  {
    value: "lazada",
    label: "Lazada",
    placeholder: "https://lazada.com.ph/shop/yourshop",
  },
  {
    value: "custom",
    label: "Custom Link",
    placeholder: "https://example.com",
  },
];

function normalizeUrl(type: string, value: string) {
  const trimmed = value.trim();

  if (type === "phone") {
    const cleaned = trimmed.replace(/\s+/g, "");
    return cleaned.startsWith("tel:") ? cleaned : `tel:${cleaned}`;
  }

  if (type === "email") {
    return trimmed.startsWith("mailto:") ? trimmed : `mailto:${trimmed}`;
  }

  return trimmed;
}

function isSafeUrl(type: string, value: string) {
  const normalized = normalizeUrl(type, value).toLowerCase();

  if (normalized.startsWith("javascript:")) return false;
  if (normalized.startsWith("data:")) return false;

  if (type === "phone") return normalized.startsWith("tel:");
  if (type === "email") return normalized.startsWith("mailto:");

  return (
    normalized.startsWith("https://") ||
    normalized.startsWith("http://") ||
    normalized.startsWith("viber://")
  );
}

function getDefaultLabel(type: string) {
  return linkTypes.find((item) => item.value === type)?.label || "Custom Link";
}

function getPlaceholder(type: string) {
  return (
    linkTypes.find((item) => item.value === type)?.placeholder ||
    "https://example.com"
  );
}

export function LinksManager({
  businessId,
  businessPlan,
  initialLinks,
}: LinksManagerProps) {
  const router = useRouter();
  const supabase = createClient();

  const [type, setType] = useState("facebook");
  const [label, setLabel] = useState(getDefaultLabel("facebook"));
  const [url, setUrl] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [showInInquire, setShowInInquire] = useState(false);
const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
const [editLabel, setEditLabel] = useState("");
const [editUrl, setEditUrl] = useState("");
const [editType, setEditType] = useState("website");
const [savingEdit, setSavingEdit] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const visibleLinksCount = initialLinks.filter((link) => link.is_visible).length;

  const libreLimitReached =
    businessPlan === "libre" && visibleLinksCount >= 3;

  function handleTypeChange(nextType: string) {
    setType(nextType);
    setLabel(getDefaultLabel(nextType));
    setUrl("");
  }

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    if (!label.trim()) {
      setMessage("Label is required.");
      setLoading(false);
      return;
    }

    if (!url.trim()) {
      setMessage("Link or contact value is required.");
      setLoading(false);
      return;
    }

    if (!isSafeUrl(type, url)) {
      setMessage(
        "Invalid or unsafe link. Use a valid https, http, phone, email, or supported app link."
      );
      setLoading(false);
      return;
    }

    if (libreLimitReached) {
      setMessage("Libre plan allows up to 3 visible contact links only.");
      setLoading(false);
      return;
    }

    const safeUrl = normalizeUrl(type, url);

    const { error } = await supabase.from("business_links").insert({
      business_id: businessId,
      type,
      label: label.trim(),
      url: safeUrl,
      icon: type,
      sort_order: sortOrder,
      is_visible: true,
      is_primary: showInInquire,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setType("facebook");
    setLabel(getDefaultLabel("facebook"));
    setUrl("");
    setSortOrder(0);
    setShowInInquire(false);
    setLoading(false);
    router.refresh();
  }

  async function toggleVisibility(link: BusinessLink) {
    if (
      businessPlan === "libre" &&
      !link.is_visible &&
      visibleLinksCount >= 3
    ) {
      setMessage("Libre plan allows up to 3 visible contact links only.");
      return;
    }

    const { error } = await supabase
      .from("business_links")
      .update({ is_visible: !link.is_visible })
      .eq("id", link.id);

    if (error) {
      setMessage(error.message);
      return;
    }

    router.refresh();
  }

  async function toggleInquireOption(link: BusinessLink) {
    const { error } = await supabase
      .from("business_links")
      .update({ is_primary: !link.is_primary })
      .eq("id", link.id);

    if (error) {
      setMessage(error.message);
      return;
    }

    router.refresh();
  }

  async function deleteLink(linkId: string) {
    const confirmed = window.confirm("Delete this contact link?");

    if (!confirmed) return;

    const { error } = await supabase
      .from("business_links")
      .delete()
      .eq("id", linkId);

    if (error) {
      setMessage(error.message);
      return;
    }

    router.refresh();
  }
  function startEdit(link: BusinessLink) {
  setEditingLinkId(link.id);
  setEditLabel(link.label);
  setEditUrl(link.url);
  setEditType(link.type);
  setMessage("");
}

function cancelEdit() {
  setEditingLinkId(null);
  setEditLabel("");
  setEditUrl("");
  setEditType("website");
}

async function saveEdit() {
  if (!editingLinkId) return;

  if (!editLabel.trim() || !editUrl.trim()) {
    setMessage("Label and URL are required.");
    return;
  }

  try {
    setSavingEdit(true);
    setMessage("");

    const { error } = await supabase
      .from("business_links")
      .update({
        label: editLabel.trim(),
        url: editUrl.trim(),
        type: editType,
      })
      .eq("id", editingLinkId);

    if (error) {
      setMessage(error.message);
      return;
    }

    cancelEdit();
    router.refresh();
  } finally {
    setSavingEdit(false);
  }
}

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.7fr]">
      <form
        onSubmit={handleCreate}
        className="rounded-3xl border border-[#E2D4C2] bg-white/80 p-6 shadow-sm"
      >
        <h2 className="text-xl font-bold text-[#3D2A1E]">Add Contact Link</h2>
        <p className="mt-2 text-sm text-stone-600">
          Add social media, location, phone, email, booking, shop, or custom
          links. Turn on “Show in Inquire Options” if you want customers to
          choose this channel after clicking an item’s Inquire button.
        </p>

        {libreLimitReached && (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            Libre plan allows up to 3 visible contact links.
          </div>
        )}

        <div className="mt-5 space-y-4">
          <div>
            <label className="text-sm font-medium text-stone-700">
              Link type
            </label>
            <select
              value={type}
              onChange={(e) => handleTypeChange(e.target.value)}
              className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 outline-none focus:border-[#C85A32]"
            >
              {linkTypes.map((linkType) => (
                <option key={linkType.value} value={linkType.value}>
                  {linkType.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-stone-700">
              Button label
            </label>
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="mt-1 w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-[#C85A32]"
              placeholder="Facebook Page"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-stone-700">
              Link / contact value
            </label>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="mt-1 w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-[#C85A32]"
              placeholder={getPlaceholder(type)}
            />
            <p className="mt-1 text-xs text-stone-500">
              For phone, enter +639XXXXXXXXX. For email, enter your email
              address. Other links should usually start with https://.
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-stone-700">
              Sort order
            </label>
            <input
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
              type="number"
              className="mt-1 w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-[#C85A32]"
            />
          </div>

          <button
            type="button"
            onClick={() => setShowInInquire((current) => !current)}
            className={`w-full rounded-2xl px-4 py-3 text-sm font-semibold ${
              showInInquire
                ? "bg-[#596B3F] text-white"
                : "border border-stone-300 bg-white text-stone-700"
            }`}
          >
            {showInInquire
              ? "Show in Inquire Options"
              : "Add to Inquire Options"}
          </button>

          {message && (
            <p className="rounded-xl bg-[#F1E5D4] px-4 py-3 text-sm text-[#5A3825]">
              {message}
            </p>
          )}

          <button
            disabled={loading || libreLimitReached}
            className="w-full rounded-2xl bg-[#C85A32] px-5 py-3 font-semibold text-white hover:bg-[#A94727] disabled:opacity-60"
          >
            {loading ? "Adding..." : "Add Link"}
          </button>
        </div>
      </form>

      <section className="rounded-3xl border border-[#E2D4C2] bg-white/80 p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-[#3D2A1E]">
              Current Links
            </h2>
            <p className="mt-1 text-sm text-stone-600">
              {initialLinks.length} link{initialLinks.length === 1 ? "" : "s"}{" "}
              added.
            </p>
          </div>

          <span className="rounded-full bg-[#F1E5D4] px-4 py-2 text-sm font-semibold text-[#5A3825]">
            Plan: {businessPlan}
          </span>
        </div>

        <div className="mt-5 space-y-3">
        
{initialLinks.length === 0 ? (
  <div className="rounded-2xl border border-dashed border-stone-300 bg-[#FFF8EF] p-6 text-center text-stone-600">
    No contact links yet. Add Facebook, Instagram, phone, map, or
    website links.
  </div>
) : (
  initialLinks.map((link) => (
    <div
      key={link.id}
      className="rounded-2xl border border-[#E7D8C5] bg-[#FFF8EF] p-4"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex-1">
          {editingLinkId === link.id ? (
            <div className="space-y-3">
              <input
                value={editLabel}
                onChange={(e) => setEditLabel(e.target.value)}
                placeholder="Label"
                className="w-full rounded-xl border border-stone-300 px-4 py-2 outline-none focus:border-[#C85A32]"
              />

              <select
                value={editType}
                onChange={(e) => setEditType(e.target.value)}
                className="w-full rounded-xl border border-stone-300 bg-white px-4 py-2 outline-none focus:border-[#C85A32]"
              >
                <option value="website">Website</option>
                <option value="facebook">Facebook</option>
                <option value="instagram">Instagram</option>
                <option value="tiktok">TikTok</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="messenger">Messenger</option>
                <option value="youtube">YouTube</option>
                <option value="google_maps">Google Maps</option>
                <option value="waze">Waze</option>
                <option value="shopee">Shopee</option>
                <option value="lazada">Lazada</option>
                <option value="phone">Phone</option>
                <option value="email">Email</option>
              </select>

              <input
                value={editUrl}
                onChange={(e) => setEditUrl(e.target.value)}
                placeholder="https://"
                className="w-full rounded-xl border border-stone-300 px-4 py-2 outline-none focus:border-[#C85A32]"
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={saveEdit}
                  disabled={savingEdit}
                  className="rounded-xl bg-[#596B3F] px-4 py-2 text-sm font-semibold text-white hover:bg-[#45532F]"
                >
                  {savingEdit ? "Saving..." : "Save"}
                </button>

                <button
                  type="button"
                  onClick={cancelEdit}
                  className="rounded-xl border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-100"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#C85A32]">
                  <LinkIcon type={link.type} />
                </span>

                <p className="font-semibold text-[#3D2A1E]">
                  {link.label}
                </p>

                <span className="rounded-full bg-white px-3 py-1 text-xs text-stone-600">
                  {link.type}
                </span>

                {link.is_primary && (
                  <span className="rounded-full bg-[#596B3F] px-3 py-1 text-xs font-semibold text-white">
                    Inquire Option
                  </span>
                )}

                <span
                  className={`rounded-full px-3 py-1 text-xs ${
                    link.is_visible
                      ? "bg-green-100 text-green-700"
                      : "bg-stone-200 text-stone-600"
                  }`}
                >
                  {link.is_visible ? "Visible" : "Hidden"}
                </span>
              </div>

              <p className="mt-2 text-sm text-stone-500">
                {link.url}
              </p>

              <p className="mt-2 text-xs text-stone-500">
                Sort order: {link.sort_order}
              </p>
            </>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => toggleInquireOption(link)}
            className="rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm text-stone-700 hover:bg-stone-100"
          >
            {link.is_primary
              ? "Remove from Inquire"
              : "Add to Inquire"}
          </button>

          <button
            type="button"
            onClick={() => toggleVisibility(link)}
            className="rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm text-stone-700 hover:bg-stone-100"
          >
            {link.is_visible ? "Hide" : "Show"}
          </button>

          <button
            type="button"
            onClick={() => startEdit(link)}
            className="rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm text-stone-700 hover:bg-stone-100"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={() => deleteLink(link.id)}
            className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 hover:bg-red-100"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  ))
)}


        </div>
      </section>
    </div>
  );
}