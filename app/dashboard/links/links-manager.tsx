
"use client";

import { createClient } from "@/lib/supabase/client";

import {
  FormEvent,
  useState,
} from "react";

import Link from "next/link";

import { useRouter } from "next/navigation";


import { LinkIcon } from "@/components/link-icon";

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
    placeholder:
      "https://facebook.com/yourpage",
  },
  {
    value: "messenger",
    label: "Messenger",
    placeholder:
      "https://m.me/yourpage",
  },
  {
    value: "instagram",
    label: "Instagram",
    placeholder:
      "https://instagram.com/yourhandle",
  },
  {
    value: "tiktok",
    label: "TikTok",
    placeholder:
      "https://tiktok.com/@yourhandle",
  },
  {
    value: "youtube",
    label: "YouTube",
    placeholder:
      "https://youtube.com/@yourchannel",
  },
  {
    value: "whatsapp",
    label: "WhatsApp",
    placeholder:
      "https://wa.me/639XXXXXXXXX",
  },
  {
    value: "phone",
    label: "Phone",
    placeholder:
      "+639XXXXXXXXX",
  },
  {
    value: "email",
    label: "Email",
    placeholder:
      "hello@example.com",
  },
  {
    value: "website",
    label: "Website",
    placeholder:
      "https://yourwebsite.com",
  },
  {
    value: "google_maps",
    label: "Google Maps",
    placeholder:
      "https://maps.google.com/...",
  },
  {
    value: "booking",
    label: "Booking Link",
    placeholder:
      "https://yourbooking.com",
  },
  {
    value: "shop",
    label: "Shop Link",
    placeholder:
      "https://yourshop.com",
  },
  {
    value: "custom",
    label: "Custom Link",
    placeholder:
      "https://example.com",
  },
];

function normalizeUrl(
  type: string,
  value: string
) {
  const trimmed =
    value.trim();

  if (type === "phone") {
    const cleaned =
      trimmed.replace(
        /\s+/g,
        ""
      );

    return cleaned.startsWith(
      "tel:"
    )
      ? cleaned
      : `tel:${cleaned}`;
  }

  if (type === "email") {
    return trimmed.startsWith(
      "mailto:"
    )
      ? trimmed
      : `mailto:${trimmed}`;
  }

  return trimmed;
}

function isSafeUrl(
  type: string,
  value: string
) {
  const normalized =
    normalizeUrl(
      type,
      value
    ).toLowerCase();

  if (
    normalized.startsWith(
      "javascript:"
    )
  )
    return false;

  if (
    normalized.startsWith(
      "data:"
    )
  )
    return false;

  if (type === "phone")
    return normalized.startsWith(
      "tel:"
    );

  if (type === "email")
    return normalized.startsWith(
      "mailto:"
    );

  return (
    normalized.startsWith(
      "https://"
    ) ||
    normalized.startsWith(
      "http://"
    )
  );
}

function getDefaultLabel(
  type: string
) {
  return (
    linkTypes.find(
      (item) =>
        item.value === type
    )?.label ||
    "Custom Link"
  );
}

function getPlaceholder(
  type: string
) {
  return (
    linkTypes.find(
      (item) =>
        item.value === type
    )?.placeholder ||
    "https://example.com"
  );
}

export default function LinksManager({
  businessId,
  businessPlan,
  initialLinks,
}: LinksManagerProps) {
  const router = useRouter();

  const supabase =
    createClient();

  const [type, setType] =
    useState("facebook");

  const [label, setLabel] =
    useState(
      getDefaultLabel(
        "facebook"
      )
    );

  const [url, setUrl] =
    useState("");

  const [
    sortOrder,
    setSortOrder,
  ] = useState(0);

  const [
    showInInquire,
    setShowInInquire,
  ] = useState(false);

  const [
    editingLinkId,
    setEditingLinkId,
  ] = useState<
    string | null
  >(null);

  const [
    editLabel,
    setEditLabel,
  ] = useState("");

  const [editUrl, setEditUrl] =
    useState("");

  const [
    editType,
    setEditType,
  ] = useState("website");

  const [
    savingEdit,
    setSavingEdit,
  ] = useState(false);

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const visibleLinksCount =
    initialLinks.filter(
      (link) =>
        link.is_visible
    ).length;

 const LINK_LIMITS = {
  libre: 5,
  pro: Infinity,
  premium: Infinity,
};

const currentLinkLimit =
  LINK_LIMITS[
    businessPlan as keyof typeof LINK_LIMITS
  ] ?? 5;

const linkLimitReached =
  visibleLinksCount >=
  currentLinkLimit;

  function handleTypeChange(
    nextType: string
  ) {
    setType(nextType);

    setLabel(
      getDefaultLabel(
        nextType
      )
    );

    setUrl("");
  }

  async function handleCreate(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setMessage("");

    setLoading(true);

    if (!label.trim()) {
      setMessage(
        "Label is required."
      );

      setLoading(false);

      return;
    }

    if (!url.trim()) {
      setMessage(
        "Link is required."
      );

      setLoading(false);

      return;
    }

    if (
      !isSafeUrl(type, url)
    ) {
      setMessage(
        "Invalid or unsafe link."
      );

      setLoading(false);

      return;
    }

    if (
      linkLimitReached
    ) {
      setMessage(
        `You have reached the ${currentLinkLimit} link limit. Upgrade your plan to add more links.`
      );

      setLoading(false);

      return;
    }

    const safeUrl =
      normalizeUrl(
        type,
        url
      );

    const { error } =
      await supabase
        .from(
          "business_links"
        )
        .insert({
          business_id:
            businessId,
          type,
          label:
            label.trim(),
          url: safeUrl,
          icon: type,
          sort_order:
            sortOrder,
          is_visible: true,
          is_primary:
            showInInquire,
        });

    if (error) {
      setMessage(
        error.message
      );

      setLoading(false);

      return;
    }

    setType("facebook");

    setLabel(
      getDefaultLabel(
        "facebook"
      )
    );

    setUrl("");

    setSortOrder(0);

    setShowInInquire(false);

    setLoading(false);

    router.refresh();
  }

  async function toggleVisibility(
    link: BusinessLink
  ) {
    const { error } =
      await supabase
        .from(
          "business_links"
        )
        .update({
          is_visible:
            !link.is_visible,
        })
        .eq("id", link.id);

    if (error) {
      setMessage(
        error.message
      );

      return;
    }

    router.refresh();
  }

  async function toggleInquireOption(
    link: BusinessLink
  ) {
    const { error } =
      await supabase
        .from(
          "business_links"
        )
        .update({
          is_primary:
            !link.is_primary,
        })
        .eq("id", link.id);

    if (error) {
      setMessage(
        error.message
      );

      return;
    }

    router.refresh();
  }

  async function deleteLink(
    linkId: string
  ) {
    const confirmed =
      window.confirm(
        "Delete this link?"
      );

    if (!confirmed) return;

    const { error } =
      await supabase
        .from(
          "business_links"
        )
        .delete()
        .eq("id", linkId);

    if (error) {
      setMessage(
        error.message
      );

      return;
    }

    router.refresh();
  }

  function startEdit(
    link: BusinessLink
  ) {
    setEditingLinkId(
      link.id
    );

    setEditLabel(
      link.label
    );

    setEditUrl(link.url);

    setEditType(link.type);

    setMessage("");
  }

  function cancelEdit() {
    setEditingLinkId(null);

    setEditLabel("");

    setEditUrl("");

    setEditType(
      "website"
    );
  }

  async function saveEdit() {
    if (!editingLinkId)
      return;

    if (
      !editLabel.trim() ||
      !editUrl.trim()
    ) {
      setMessage(
        "Label and URL are required."
      );

      return;
    }

    try {
      setSavingEdit(true);

      const { error } =
        await supabase
          .from(
            "business_links"
          )
          .update({
            label:
              editLabel.trim(),
            url:
              editUrl.trim(),
            type: editType,
          })
          .eq(
            "id",
            editingLinkId
          );

      if (error) {
        setMessage(
          error.message
        );

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
      {/* FORM */}
      <form
        onSubmit={
          handleCreate
        }
        className="rounded-[2rem] border border-[#E7D8C5] bg-white p-6 shadow-sm"
      >
        <h2 className="text-2xl font-black tracking-tight text-[#3D2A1E]">
          Add Contact Link
        </h2>

     <h2 className="text-2xl font-black tracking-tight text-[#3D2A1E]">
  Add Contact Link
</h2>

<p className="mt-2 text-sm font-medium text-[#8A6A4F]">
  {visibleLinksCount}
  {currentLinkLimit !== Infinity
    ? ` / ${currentLinkLimit}`
    : ""}{" "}
  visible links used
</p>

<p className="mt-2 text-sm leading-relaxed text-stone-600">
  Add Facebook,
  Messenger,
  Instagram,
  phone numbers,
  booking links, or
  websites so customers
  can reach you.
</p>

        {linkLimitReached && (
          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            {`You have reached your plan limit of ${currentLinkLimit} visible links.Upgrade to Pro for unlimited links.`}
          </div>
        )}

        <div className="mt-5 space-y-4">
          <select
            value={type}
            onChange={(e) =>
              handleTypeChange(
                e.target.value
              )
            }
            className="w-full rounded-2xl border border-[#D8C6B3] bg-white px-4 py-4 outline-none focus:border-[#C85A32]"
          >
            {linkTypes.map(
              (linkType) => (
                <option
                  key={
                    linkType.value
                  }
                  value={
                    linkType.value
                  }
                >
                  {
                    linkType.label
                  }
                </option>
              )
            )}
          </select>

          <input
            value={label}
            onChange={(e) =>
              setLabel(
                e.target.value
              )
            }
            placeholder="Button Label"
            className="w-full rounded-2xl border border-[#D8C6B3] px-4 py-4 outline-none focus:border-[#C85A32]"
          />

          <input
            value={url}
            onChange={(e) =>
              setUrl(
                e.target.value
              )
            }
            placeholder={getPlaceholder(
              type
            )}
            className="w-full rounded-2xl border border-[#D8C6B3] px-4 py-4 outline-none focus:border-[#C85A32]"
          />

          <input
            type="number"
            value={sortOrder}
            onChange={(e) =>
              setSortOrder(
                Number(
                  e.target.value
                )
              )
            }
            placeholder="Sort Order"
            className="w-full rounded-2xl border border-[#D8C6B3] px-4 py-4 outline-none focus:border-[#C85A32]"
          />

          <button
            type="button"
            onClick={() =>
              setShowInInquire(
                (
                  current
                ) => !current
              )
            }
            className={`w-full rounded-2xl px-4 py-4 text-sm font-semibold ${
              showInInquire
                ? "bg-[#596B3F] text-white"
                : "border border-stone-300 bg-white text-stone-700"
            }`}
          >
            {showInInquire
              ? "Included in Inquiry Options"
              : "Add to Inquiry Options"}
          </button>

          {message && (
            <div className="rounded-2xl bg-[#F1E5D4] px-4 py-3 text-sm text-[#5A3825]">
              {message}
            </div>
          )}

          <button
            disabled={
              loading ||
              linkLimitReached
            }
            className="w-full rounded-2xl bg-[#C85A32] px-6 py-4 font-semibold text-white shadow-lg transition hover:scale-[1.02] disabled:opacity-60"
          >
            {loading
              ? "Adding..."
              : "Add Link"}
          </button>
        </div>
      </form>

      {/* LIST */}
      <section className="rounded-[2rem] border border-[#E7D8C5] bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-[#3D2A1E]">
              Contact Links
            </h2>

            <p className="mt-1 text-sm text-stone-600">
              {
                initialLinks.length
              }{" "}
              link
              {initialLinks.length ===
              1
                ? ""
                : "s"}{" "}
              added
            </p>
          </div>

          <span className="rounded-full bg-[#F1E5D4] px-4 py-2 text-sm font-semibold text-[#5A3825]">
            {businessPlan}
          </span>
        </div>

        <div className="mt-6 space-y-4">
          {initialLinks.length ===
          0 ? (
            <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-[#D8C6B3] bg-[#FFF8EF] px-8 py-20 text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-sm">
                🔗
              </div>

              <h3 className="mt-6 text-3xl font-black tracking-tight text-[#3D2A1E]">
                No links yet
              </h3>

              <p className="mt-4 max-w-md text-base leading-relaxed text-stone-600">
                Add Facebook,
                Messenger,
                Instagram,
                booking links, or
                contact details so
                customers can reach
                your business.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  className="rounded-2xl bg-[#C85A32] px-6 py-4 font-semibold text-white shadow-lg transition hover:scale-[1.02]"
                >
                  Add First Link
                </button>

                <Link
                  href="/dashboard/items"
                  className="rounded-2xl border border-[#D8C6B3] bg-white px-6 py-4 font-semibold text-[#3D2A1E] transition hover:bg-[#F8F4EC]"
                >
                  Manage Items
                </Link>
              </div>
            </div>
          ) : (
            initialLinks.map(
              (link) => (
                <div
                  key={link.id}
                  className="rounded-[2rem] border border-[#E7D8C5] bg-[#FFF8EF] p-5"
                >
                  <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                    {/* LEFT */}
                    <div className="flex-1">
                      {editingLinkId ===
                      link.id ? (
                        <div className="space-y-3">
                          <input
                            value={
                              editLabel
                            }
                            onChange={(
                              e
                            ) =>
                              setEditLabel(
                                e
                                  .target
                                  .value
                              )
                            }
                            className="w-full rounded-2xl border border-[#D8C6B3] px-4 py-3 outline-none focus:border-[#C85A32]"
                          />

                          <select
                            value={
                              editType
                            }
                            onChange={(
                              e
                            ) =>
                              setEditType(
                                e
                                  .target
                                  .value
                              )
                            }
                            className="w-full rounded-2xl border border-[#D8C6B3] bg-white px-4 py-3 outline-none focus:border-[#C85A32]"
                          >
                            {linkTypes.map(
                              (
                                item
                              ) => (
                                <option
                                  key={
                                    item.value
                                  }
                                  value={
                                    item.value
                                  }
                                >
                                  {
                                    item.label
                                  }
                                </option>
                              )
                            )}
                          </select>

                          <input
                            value={
                              editUrl
                            }
                            onChange={(
                              e
                            ) =>
                              setEditUrl(
                                e
                                  .target
                                  .value
                              )
                            }
                            className="w-full rounded-2xl border border-[#D8C6B3] px-4 py-3 outline-none focus:border-[#C85A32]"
                          />

                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={
                                saveEdit
                              }
                              disabled={
                                savingEdit
                              }
                              className="rounded-xl bg-[#596B3F] px-4 py-2 text-sm font-semibold text-white"
                            >
                              {savingEdit
                                ? "Saving..."
                                : "Save"}
                            </button>

                            <button
                              type="button"
                              onClick={
                                cancelEdit
                              }
                              className="rounded-xl border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#C85A32]">
                              <LinkIcon
                                type={
                                  link.type
                                }
                              />
                            </span>

                            <h3 className="text-lg font-black text-[#3D2A1E]">
                              {
                                link.label
                              }
                            </h3>

                            <span className="rounded-full bg-white px-3 py-1 text-xs text-stone-600">
                              {
                                link.type
                              }
                            </span>

                            {link.is_primary && (
                              <span className="rounded-full bg-[#596B3F] px-3 py-1 text-xs font-semibold text-white">
                                Inquiry
                              </span>
                            )}

                            <span
                              className={`rounded-full px-3 py-1 text-xs ${
                                link.is_visible
                                  ? "bg-green-100 text-green-700"
                                  : "bg-stone-200 text-stone-600"
                              }`}
                            >
                              {link.is_visible
                                ? "Visible"
                                : "Hidden"}
                            </span>
                          </div>

                          <p className="mt-3 break-all text-sm text-stone-500">
                            {link.url}
                          </p>
                        </>
                      )}
                    </div>

                    {/* ACTIONS */}
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          toggleInquireOption(
                            link
                          )
                        }
                        className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm font-semibold text-stone-700"
                      >
                        {link.is_primary
                          ? "Remove Inquiry"
                          : "Add Inquiry"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          toggleVisibility(
                            link
                          )
                        }
                        className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm font-semibold text-stone-700"
                      >
                        {link.is_visible
                          ? "Hide"
                          : "Show"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          startEdit(
                            link
                          )
                        }
                        className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm font-semibold text-stone-700"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          deleteLink(
                            link.id
                          )
                        }
                        className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )
            )
          )}
        </div>
      </section>
    </div>
  );
}
