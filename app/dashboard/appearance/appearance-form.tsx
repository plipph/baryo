
"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

type AppearanceSettings = {
  id?: string;
  business_id?: string;

  theme: string;
  accent_color: string;
  surface_style: string;
  card_radius: string;
  button_style: string;
  font_style: string;
};

type AppearanceFormProps = {
  businessId: string;
  initialAppearance: AppearanceSettings | null;
};

const themes = [
  {
    value: "earthy",
    label: "Earthy",
  },
  {
    value: "minimal",
    label: "Minimal",
  },
  {
    value: "dark",
    label: "Dark",
  },
  {
    value: "modern",
    label: "Modern",
  },
];

const accentColors = [
  "#C85A32",
  "#596B3F",
  "#3B82F6",
  "#7C3AED",
  "#111827",
  "#EC4899",
];

export function AppearanceForm({
  businessId,
  initialAppearance,
}: AppearanceFormProps) {
  const router = useRouter();

  const supabase = createClient();

  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");

  const [theme, setTheme] = useState(
    initialAppearance?.theme || "earthy"
  );

  const [accentColor, setAccentColor] = useState(
    initialAppearance?.accent_color || "#C85A32"
  );

  const [surfaceStyle, setSurfaceStyle] = useState(
    initialAppearance?.surface_style || "glass"
  );

  const [cardRadius, setCardRadius] = useState(
    initialAppearance?.card_radius || "rounded"
  );

  const [buttonStyle, setButtonStyle] = useState(
    initialAppearance?.button_style || "rounded"
  );

  const [fontStyle, setFontStyle] = useState(
    initialAppearance?.font_style || "modern"
  );

  async function handleSave() {
    try {
      setSaving(true);
      setMessage("");

      const payload = {
        business_id: businessId,
        theme,
        accent_color: accentColor,
        surface_style: surfaceStyle,
        card_radius: cardRadius,
        button_style: buttonStyle,
        font_style: fontStyle,
      };

      let error = null;

      if (initialAppearance?.id) {
        const response = await supabase
          .from("appearance_settings")
          .update(payload)
          .eq("id", initialAppearance.id);

        error = response.error;
      } else {
        const response = await supabase
          .from("appearance_settings")
          .insert(payload);

        error = response.error;
      }

      if (error) {
        setMessage(error.message);
        return;
      }

      setMessage("Appearance updated successfully.");

      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
      {/* SETTINGS */}
      <div className="space-y-6">
        {/* THEME */}
        <section className="rounded-[2rem] border border-[#E7D8C5] bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-[#3D2A1E]">
            Theme
          </h2>

          <p className="mt-2 text-sm text-stone-600">
            Select your storefront style.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {themes.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setTheme(item.value)}
                className={`rounded-2xl border p-5 text-left transition-all ${
                  theme === item.value
                    ? "border-[#596B3F] bg-[#EEF5E6]"
                    : "border-[#E7D8C5] bg-white hover:bg-[#F8F4EC]"
                }`}
              >
                <p className="text-lg font-bold text-[#3D2A1E]">
                  {item.label}
                </p>

                <p className="mt-2 text-sm text-stone-600">
                  {item.value} storefront style
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* ACCENT COLOR */}
        <section className="rounded-[2rem] border border-[#E7D8C5] bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-[#3D2A1E]">
            Accent Color
          </h2>

          <p className="mt-2 text-sm text-stone-600">
            Customize buttons and highlights.
          </p>

          <div className="mt-6 flex flex-wrap gap-4">
            {accentColors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setAccentColor(color)}
                className={`h-14 w-14 rounded-2xl border-4 transition-all ${
                  accentColor === color
                    ? "border-black scale-110"
                    : "border-white"
                }`}
                style={{
                  backgroundColor: color,
                }}
              />
            ))}
          </div>
        </section>

        {/* CARD STYLE */}
        <section className="rounded-[2rem] border border-[#E7D8C5] bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-[#3D2A1E]">
            Card Radius
          </h2>

          <div className="mt-6 flex flex-wrap gap-3">
            {["sharp", "rounded", "pill"].map((radius) => (
              <button
                key={radius}
                type="button"
                onClick={() => setCardRadius(radius)}
                className={`rounded-2xl px-5 py-3 text-sm font-semibold transition-all ${
                  cardRadius === radius
                    ? "bg-[#596B3F] text-white"
                    : "border border-[#E7D8C5] bg-white text-stone-700"
                }`}
              >
                {radius}
              </button>
            ))}
          </div>
        </section>

        {/* BUTTON STYLE */}
        <section className="rounded-[2rem] border border-[#E7D8C5] bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-[#3D2A1E]">
            Button Style
          </h2>

          <div className="mt-6 flex flex-wrap gap-3">
            {["rounded", "pill", "sharp"].map((style) => (
              <button
                key={style}
                type="button"
                onClick={() => setButtonStyle(style)}
                className={`rounded-2xl px-5 py-3 text-sm font-semibold transition-all ${
                  buttonStyle === style
                    ? "bg-[#596B3F] text-white"
                    : "border border-[#E7D8C5] bg-white text-stone-700"
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </section>

        {/* SAVE */}
        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-2xl bg-[#C85A32] px-6 py-4 font-semibold text-white transition-all hover:bg-[#A94727]"
          >
            {saving ? "Saving..." : "Save Appearance"}
          </button>

          {message && (
            <p className="text-sm text-stone-600">
              {message}
            </p>
          )}
        </div>
      </div>

      {/* LIVE PREVIEW */}
      <div className="sticky top-24 h-fit">
        <div className="overflow-hidden rounded-[2rem] border border-[#E7D8C5] bg-white shadow-xl">
          <div
            className="h-40"
            style={{
              background:
                theme === "dark"
                  ? "#111827"
                  : `linear-gradient(135deg, ${accentColor}, #111827)`,
            }}
          />

          <div className="-mt-12 px-6 pb-6">
            <div
              className={`h-24 w-24 border-4 border-white bg-white shadow-xl ${
                cardRadius === "pill"
                  ? "rounded-full"
                  : cardRadius === "sharp"
                  ? "rounded-none"
                  : "rounded-[2rem]"
              }`}
            />

            <h3 className="mt-5 text-3xl font-black text-[#3D2A1E]">
              Your Business
            </h3>

            <p className="mt-2 text-sm text-stone-600">
              Live storefront preview
            </p>

            <button
              className={`mt-6 px-5 py-3 text-sm font-semibold text-white ${
                buttonStyle === "pill"
                  ? "rounded-full"
                  : buttonStyle === "sharp"
                  ? "rounded-none"
                  : "rounded-2xl"
              }`}
              style={{
                backgroundColor: accentColor,
              }}
            >
              Inquire Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

