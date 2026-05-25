"use client";

import { createClient } from "@/lib/supabase/client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Category = {
  id: string;
  business_id: string;
  name: string;
  sort_order: number;
  is_visible: boolean;
};

type CategoriesManagerProps = {
  businessId: string;
  initialCategories: Category[];
};

export function CategoriesManager({
  businessId,
  initialCategories,
}: CategoriesManagerProps) {
  const router = useRouter();
  const supabase = createClient();

  const [name, setName] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [message, setMessage] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    if (!name.trim()) {
      setMessage("Category name is required.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("categories").insert({
      business_id: businessId,
      name: name.trim(),
      sort_order: sortOrder,
      is_visible: true,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setName("");
    setSortOrder(0);
    setLoading(false);
    router.refresh();
  }

  async function toggleVisibility(category: Category) {
    const { error } = await supabase
      .from("categories")
      .update({ is_visible: !category.is_visible })
      .eq("id", category.id);

    if (error) {
      setMessage(error.message);
      return;
    }

    router.refresh();
  }

  async function deleteCategory(categoryId: string) {
    const confirmed = window.confirm(
      "Delete this category? Items under this category will become uncategorized."
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", categoryId);

    if (error) {
      setMessage(error.message);
      return;
    }

    router.refresh();
  }

  function startEdit(categoryId: string, currentName: string) {
  setEditingCategoryId(categoryId);
  setEditingName(currentName);
  setMessage("");
}

function cancelEdit() {
  setEditingCategoryId(null);
  setEditingName("");
}

async function saveEdit() {
  if (!editingCategoryId) return;

  if (!editingName.trim()) {
    setMessage("Category name is required.");
    return;
  }

  try {
    setSavingEdit(true);
    setMessage("");

    const { error } = await supabase
      .from("categories")
      .update({
        name: editingName.trim(),
      })
      .eq("id", editingCategoryId);

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
    <div className="grid gap-6 lg:grid-cols-[1fr_1.5fr]">
      <form
        onSubmit={handleCreate}
        className="rounded-3xl border border-[#E2D4C2] bg-white/80 p-6 shadow-sm"
      >
        <h2 className="text-xl font-bold text-[#3D2A1E]">Add Category</h2>
        <p className="mt-2 text-sm text-stone-600">
          Examples: Food, Drinks, Rooms, Services, Packages.
        </p>

        <div className="mt-5 space-y-4">
          <div>
            <label className="text-sm font-medium text-stone-700">
              Category name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-[#C85A32]"
              placeholder="Pinoy Favorites"
            />
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

          {message && (
            <p className="rounded-xl bg-[#F1E5D4] px-4 py-3 text-sm text-[#5A3825]">
              {message}
            </p>
          )}

          <button
            disabled={loading}
            className="w-full rounded-2xl bg-[#C85A32] px-5 py-3 font-semibold text-white hover:bg-[#A94727] disabled:opacity-60"
          >
            {loading ? "Adding..." : "Add Category"}
          </button>
        </div>
      </form>

      <section className="rounded-3xl border border-[#E2D4C2] bg-white/80 p-6 shadow-sm">
        <h2 className="text-xl font-bold text-[#3D2A1E]">
          Current Categories
        </h2>

        <div className="mt-5 space-y-3">
          {initialCategories.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-stone-300 bg-[#FFF8EF] p-6 text-center text-stone-600">
              No categories yet. Add your first category.
            </div>
          ) : (
            initialCategories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between rounded-2xl border border-[#E7D8C5] bg-[#FFF8EF] p-4"
              >
                <div>
                {editingCategoryId === category.id ? (
  <div className="flex flex-col gap-3">
    <input
      value={editingName}
      onChange={(e) => setEditingName(e.target.value)}
      className="rounded-xl border border-stone-300 px-4 py-2 outline-none focus:border-[#C85A32]"
    />

    <div className="flex gap-2">
      <button
        type="button"
        onClick={saveEdit}
        className="rounded-xl bg-[#596B3F] px-4 py-2 text-sm font-semibold text-white hover:bg-[#45532F]"
      >
        Save
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
  <h3 className="font-semibold">{category.name}</h3>
)}
                  <p className="text-sm text-stone-500">
                    Sort order: {category.sort_order} ·{" "}
                    {category.is_visible ? "Visible" : "Hidden"}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => toggleVisibility(category)}
                    className="rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm text-stone-700 hover:bg-stone-100"
                  >
                    {category.is_visible ? "Hide" : "Show"}
                  </button>

                  <button
                    type="button"
                      onClick={() => startEdit(category.id, category.name)}
                        className="rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm text-stone-700 hover:bg-stone-100"
                          >
                            Edit
                              </button>

                  <button
                    type="button"
                    onClick={() => deleteCategory(category.id)}
                    className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}