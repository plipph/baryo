"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { LinkIcon } from "@/components/link-icon";

import {
  Search,
  ExternalLink,
  X,
} from "lucide-react";

type Category = {
  id: string;
  name: string;
};

type Item = {
  id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  image_url: string | null;
  price: number | null;
};

type LinkItem = {
  id: string;
  label: string;
  url: string;
  type: string;
  is_primary: boolean;
};

type AppearanceSettings = {
  theme: string;
  accent_color: string;
  surface_style: string;
  card_radius: string;
  button_style: string;
  font_style: string;
} | null;

type PublicStorefrontProps = {
  businessId: string;
  categories: Category[];
  items: Item[];
  links: LinkItem[];
  appearance: AppearanceSettings;
};

const themeStyles = {
  earthy: {
    page: "bg-[#F6F1E8] text-stone-900",
    card: "bg-white border-[#E7D8C5]",
    muted: "text-stone-600",
    surface: "bg-[#F8F4EC]",
  },

  minimal: {
    page: "bg-white text-stone-900",
    card: "bg-[#FAFAFA] border-[#EEEEEE]",
    muted: "text-stone-500",
    surface: "bg-[#F5F5F5]",
  },

  dark: {
    page: "bg-[#111827] text-white",
    card: "bg-[#1F2937] border-[#374151]",
    muted: "text-gray-300",
    surface: "bg-[#0F172A]",
  },

  modern: {
    page: "bg-[#F4F7FB] text-[#111827]",
    card: "bg-white border-[#DCE3EE]",
    muted: "text-slate-500",
    surface: "bg-[#EEF2FF]",
  },
};


export function PublicStorefront({
  businessId,
  categories,
  items,
  links,
  appearance,
}: PublicStorefrontProps)
 {
  const [search, setSearch] = useState("");

  const [activeCategory, setActiveCategory] =
    useState<string | null>(null);

  const [selectedItem, setSelectedItem] =
    useState<Item | null>(null);

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const sectionRefs = useRef<
    Record<string, HTMLElement | null>
  >({});

  const accentColor =
    appearance?.accent_color || "#C85A32";

  const cardRadius =
    appearance?.card_radius || "rounded";

  const buttonStyle =
    appearance?.button_style || "rounded";

  const theme =
    appearance?.theme || "earthy";

  const cardRadiusClass =
    cardRadius === "pill"
      ? "rounded-[3rem]"
      : cardRadius === "sharp"
      ? "rounded-none"
      : "rounded-[2rem]";

  const buttonRadiusClass =
    buttonStyle === "pill"
      ? "rounded-full"
      : buttonStyle === "sharp"
      ? "rounded-none"
      : "rounded-2xl";

  const currentTheme =
    themeStyles[
      theme as keyof typeof themeStyles
    ] || themeStyles.earthy;

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow =
        "hidden";
    } else {
      document.body.style.overflow =
        "auto";
    }

    return () => {
      document.body.style.overflow =
        "auto";
    };
  }, [isModalOpen]);

  const filteredItems = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return items.filter((item) => {
      const matchesSearch =
        item.name
          .toLowerCase()
          .includes(query) ||
        item.description
          ?.toLowerCase()
          .includes(query);

      const matchesCategory =
        !activeCategory ||
        item.category_id === activeCategory;

      return (
        matchesSearch &&
        matchesCategory
      );
    });
  }, [items, search, activeCategory]);

  const groupedItems = useMemo(() => {
    return categories.map((category) => ({
      category,
      items: filteredItems.filter(
        (item) =>
          item.category_id ===
          category.id
      ),
    }));
  }, [categories, filteredItems]);

  return (
    <div
      className={`min-h-screen w-full overflow-x-hidden ${currentTheme.page}`}
      style={{
        WebkitTapHighlightColor:
          "transparent",
      }}
    >
      <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
        {/* SEARCH */}
        <div
          className={`sticky top-[env(safe-area-inset-top)] z-20 mb-6 w-full border p-3 md:mb-8 md:p-4 shadow-lg backdrop-blur-xl ${cardRadiusClass} ${currentTheme.card}`}
        >
          <div
            className={`flex w-full items-center gap-3 overflow-hidden px-4 py-4 ${buttonRadiusClass} ${currentTheme.surface}`}
          >
            <Search className="h-5 w-5 shrink-0 text-stone-400" />

            <input
              type="text"
              aria-label="Search products"
              placeholder="Search products or services..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full min-w-0 bg-transparent text-sm outline-none"
            />
          </div>

          {/* CATEGORIES */}
          {categories.length > 0 && (
            <div className="mt-4 flex max-w-full gap-3 overflow-x-auto pb-1">
              <button
                onClick={() =>
                  setActiveCategory(null)
                }
                className={`shrink-0 whitespace-nowrap px-5 py-3 text-sm font-semibold transition-all ${buttonRadiusClass} ${
                  activeCategory === null
                    ? "text-white"
                    : "border border-[#E7D8C5] bg-white text-stone-700"
                }`}
                style={{
                  backgroundColor:
                    activeCategory === null
                      ? accentColor
                      : undefined,
                }}
              >
                All
              </button>

              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setActiveCategory(
                      category.id
                    );

                    sectionRefs.current[
                      category.id
                    ]?.scrollIntoView({
                      behavior:
                        "smooth",
                      block: "start",
                    });
                  }}
                  className={`shrink-0 whitespace-nowrap px-5 py-3 text-sm font-semibold transition-all ${buttonRadiusClass} ${
                    activeCategory ===
                    category.id
                      ? "text-white"
                      : "border border-[#E7D8C5] bg-white text-stone-700"
                  }`}
                  style={{
                    backgroundColor:
                      activeCategory ===
                      category.id
                        ? accentColor
                        : undefined,
                  }}
                >
                  {category.name}
                </button>
              ))}
            </div>
          )}

          {/* COUNT */}
          <div
            className={`mt-4 text-sm ${currentTheme.muted}`}
          >
            {filteredItems.length} item
            {filteredItems.length !== 1
              ? "s"
              : ""}{" "}
            found
          </div>
        </div>

        {/* EMPTY */}
        {filteredItems.length === 0 && (
          <div className="rounded-[2rem] border border-dashed border-[#D8C7B4] bg-white/60 p-10 text-center md:p-12">
            <h3
              className={`text-2xl font-bold ${
                theme === "dark"
                  ? "text-white"
                  : "text-[#3D2A1E]"
              }`}
            >
              No matching items
            </h3>

            <p
              className={`mt-3 ${currentTheme.muted}`}
            >
              Try another keyword or
              category.
            </p>
          </div>
        )}

        {/* ITEMS */}
        <div className="space-y-12 md:space-y-14">
          {groupedItems.map(
            ({ category, items }) => {
              if (items.length === 0)
                return null;

              return (
                <section
                  key={category.id}
                  ref={(element) => {
                    sectionRefs.current[
                      category.id
                    ] = element;
                  }}
                >
                  {/* HEADER */}
                  <div className="mb-5 flex items-center justify-between md:mb-6">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8A6A4F] md:text-sm">
                        Category
                      </p>

                      <h2
                        className={`mt-2 break-words text-3xl font-black tracking-tight md:text-4xl ${
                          theme ===
                          "dark"
                            ? "text-white"
                            : "text-[#3D2A1E]"
                        }`}
                      >
                        {category.name}
                      </h2>
                    </div>

                    <div className="hidden md:block">
                      <div
                        className={`${buttonRadiusClass} px-5 py-2 text-sm font-semibold text-white`}
                        style={{
                          backgroundColor:
                            accentColor,
                        }}
                      >
                        {items.length} item
                        {items.length !==
                        1
                          ? "s"
                          : ""}
                      </div>
                    </div>
                  </div>

                  {/* GRID */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 md:gap-6">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        role="button"
                        tabIndex={0}
                        aria-label={`Open ${item.name}`}
                       onClick={async () => { setSelectedItem(item); setIsModalOpen(true); try { await fetch( `/api/track-item?businessId=${businessId}&itemId=${item.id}` ); } catch (error) { console.error(error); } }}
                        onKeyDown={(
                          e
                        ) => {
                          if (
                            e.key ===
                              "Enter" ||
                            e.key ===
                              " "
                          ) {
                            setSelectedItem(
                              item
                            );

                            setIsModalOpen(
                              true
                            );
                          }
                        }}
                        className={`group w-full cursor-pointer overflow-hidden border text-left shadow-sm transition-all active:scale-[0.98] md:hover:-translate-y-1 md:hover:shadow-2xl ${cardRadiusClass} ${currentTheme.card}`}
                      >
                        {/* IMAGE */}
                        {item.image_url ? (
                          <div className="relative h-52 overflow-hidden md:h-56">
                            <img
                              loading="lazy"
                              decoding="async"
                              draggable={
                                false
                              }
                              src={
                                item.image_url
                              }
                              alt={
                                item.name
                              }
                              className="block h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
                            />
                          </div>
                        ) : (
                          <div className="flex h-52 items-center justify-center bg-[#F3E7D7] text-sm text-stone-500 md:h-56">
                            No image
                          </div>
                        )}

                        {/* CONTENT */}
                        <div className="p-5 md:p-6">
                          <div className="flex min-w-0 items-start justify-between gap-4">
                            <div className="min-w-0 flex-1">
                              <h3
                                className={`break-words text-xl font-bold tracking-tight md:text-2xl ${
                                  theme ===
                                  "dark"
                                    ? "text-white"
                                    : "text-[#3D2A1E]"
                                }`}
                              >
                                {item.name}
                              </h3>

                              {item.description && (
                                <p
                                  className={`mt-3 line-clamp-3 break-words text-sm leading-relaxed ${currentTheme.muted}`}
                                >
                                  {
                                    item.description
                                  }
                                </p>
                              )}
                            </div>

                            {item.price !==
                              null && (
                              <div
                                className={`${buttonRadiusClass} shrink-0 px-4 py-2 text-sm font-bold text-white`}
                                style={{
                                  backgroundColor:
                                    accentColor,
                                }}
                              >
                                ₱
                                {
                                  item.price
                                }
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );
            }
          )}
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen &&
        selectedItem && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/60 p-4 backdrop-blur-sm"
            onClick={() => {
              setIsModalOpen(false);

              setSelectedItem(null);
            }}
          >
            <div
              onClick={(e) =>
                e.stopPropagation()
              }
              style={{
                WebkitOverflowScrolling:
                  "touch",
              }}
              className={`relative w-full max-w-2xl max-h-[90vh] overflow-x-hidden overflow-y-auto border shadow-2xl ${cardRadiusClass} ${currentTheme.card}`}
            >
              {/* CLOSE */}
              <button
                onClick={() => {
                  setIsModalOpen(false);

                  setSelectedItem(null);
                }}
                className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur-md"
              >
                <X className="h-5 w-5" />
              </button>

              {/* IMAGE */}
              {selectedItem.image_url ? (
                <div className="h-72 w-full overflow-hidden md:h-96">
                  <img
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                    src={
                      selectedItem.image_url
                    }
                    alt={
                      selectedItem.name
                    }
                    className="block h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-72 items-center justify-center bg-[#F3E7D7] text-stone-500">
                  No image
                </div>
              )}

              {/* BODY */}
              <div className="p-6 md:p-8">
                <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <h2
                      className={`break-words text-3xl font-black tracking-tight md:text-4xl ${
                        theme === "dark"
                          ? "text-white"
                          : "text-[#3D2A1E]"
                      }`}
                    >
                      {
                        selectedItem.name
                      }
                    </h2>

                    {selectedItem.description && (
                      <p
                        className={`mt-4 break-words text-base leading-relaxed ${currentTheme.muted}`}
                      >
                        {
                          selectedItem.description
                        }
                      </p>
                    )}
                  </div>

                  {selectedItem.price !==
                    null && (
                    <div
                      className={`${buttonRadiusClass} w-fit shrink-0 px-5 py-3 text-sm font-bold text-white`}
                      style={{
                        backgroundColor:
                          accentColor,
                      }}
                    >
                      ₱
                      {
                        selectedItem.price
                      }
                    </div>
                  )}
                </div>

                {/* LINKS */}
                {links.length > 0 && (
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    {links.map((link) => (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex w-full items-center justify-center gap-2 px-5 py-4 text-sm font-semibold text-white transition-all hover:opacity-90 sm:w-auto ${buttonRadiusClass}`}
                        style={{
                          backgroundColor:
                            accentColor,
                        }}
                      >
                        <LinkIcon
                          type={
                            link.type
                          }
                        />

                        {link.label}

                        <ExternalLink className="h-4 w-4" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
    </div>
  );
}