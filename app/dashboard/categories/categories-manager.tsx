
"use client";

import { useState } from "react";
import Link from "next/link";

import { createClient } from "@/lib/supabase/client";

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
  const supabase = createClient();

  const [categories, setCategories] =
    useState(initialCategories);

  const [name, setName] =
    useState("");

  const [
    editingCategoryId,
    setEditingCategoryId,
  ] = useState<string | null>(
    null
  );

  const [editingName, setEditingName] =
    useState("");

  async function createCategory(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (!name.trim()) return;

    const { data, error } =
      await supabase
        .from("categories")
        .insert({
          business_id:
            businessId,
          name,
        })
        .select()
        .single();

    if (error) {
      console.error(error);
      return;
    }

    setCategories([
      ...categories,
      data,
    ]);

    setName("");
  }

  async function deleteCategory(
    id: string
  ) {
    const confirmed =
      window.confirm(
        "Delete this category?"
      );

    if (!confirmed) return;

    const { error } =
      await supabase
        .from("categories")
        .delete()
        .eq("id", id);

    if (error) {
      console.error(error);
      return;
    }

    setCategories(
      categories.filter(
        (category) =>
          category.id !== id
      )
    );
  }

  async function toggleVisibility(
    category: Category
  ) {
    const { data, error } =
      await supabase
        .from("categories")
        .update({
          is_visible:
            !category.is_visible,
        })
        .eq("id", category.id)
        .select()
        .single();

    if (error) {
      console.error(error);
      return;
    }

    setCategories(
      categories.map((item) =>
        item.id === category.id
          ? data
          : item
      )
    );
  }

  function startEdit(
    id: string,
    currentName: string
  ) {
    setEditingCategoryId(id);

    setEditingName(currentName);
  }

  function cancelEdit() {
    setEditingCategoryId(null);

    setEditingName("");
  }

  async function saveEdit() {
    if (
      !editingCategoryId ||
      !editingName.trim()
    )
      return;

    const { data, error } =
      await supabase
        .from("categories")
        .update({
          name: editingName,
        })
        .eq(
          "id",
          editingCategoryId
        )
        .select()
        .single();

    if (error) {
      console.error(error);
      return;
    }

    setCategories(
      categories.map((item) =>
        item.id ===
        editingCategoryId
          ? data
          : item
      )
    );

    cancelEdit();
  }

  return (
    <section className="rounded-[2rem] border border-[#E5E7EB] bg-white p-6 shadow-sm">
      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-3xl font-black tracking-tight text-[#111827]">
          Categories
        </h2>

        <p className="mt-2 text-stone-600">
          Organize your products
          and services into clear
          sections.
        </p>
      </div>

      {/* CREATE FORM */}
      <form
        onSubmit={
          createCategory
        }
        className="flex flex-col gap-3 rounded-[2rem] border border-[#E5E7EB] bg-[#FFFFFF] p-5 md:flex-row"
      >
        <input
          type="text"
          placeholder="Category name"
          value={name}
          onChange={(e) =>
            setName(
              e.target.value
            )
          }
          className="flex-1 rounded-2xl border border-[#E5E7EB] bg-white px-4 py-4 outline-none focus:border-[#14532D]"
        />

        <button
          type="submit"
          className="rounded-2xl bg-[#14532D] px-6 py-4 font-semibold text-white shadow-lg transition hover:scale-[1.02]"
        >
          Add Category
        </button>
      </form>

      {/* LIST */}
      <div className="mt-6 space-y-4">
        {categories.length ===
        0 ? (
          <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-[#E5E7EB] bg-[#FFFFFF] px-8 py-20 text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-sm">
              🗂️
            </div>

            <h3 className="mt-6 text-3xl font-black tracking-tight text-[#111827]">
              No categories yet
            </h3>

            <p className="mt-4 max-w-md text-base leading-relaxed text-stone-600">
              Organize your
              products or services
              into categories like
              Coffee, Meals,
              Packages, Services,
              or Desserts.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                className="rounded-2xl bg-[#14532D] px-6 py-4 font-semibold text-white shadow-lg transition hover:scale-[1.02]"
              >
                Create Category
              </button>

              <Link
                href="/dashboard/items"
                className="rounded-2xl border border-[#E5E7EB] bg-white px-6 py-4 font-semibold text-[#111827] transition hover:bg-[#F9FAFB]"
              >
                Manage Items
              </Link>
            </div>
          </div>
        ) : (
          categories.map(
            (category) => (
              <div
                key={
                  category.id
                }
                className="flex flex-col gap-4 rounded-[2rem] border border-[#E5E7EB] bg-[#FFFFFF] p-5 md:flex-row md:items-center md:justify-between"
              >
                {/* LEFT */}
                <div>
                  {editingCategoryId ===
                  category.id ? (
                    <div className="flex flex-col gap-3">
                      <input
                        value={
                          editingName
                        }
                        onChange={(
                          e
                        ) =>
                          setEditingName(
                            e.target
                              .value
                          )
                        }
                        className="rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3 outline-none focus:border-[#14532D]"
                      />

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={
                            saveEdit
                          }
                          className="rounded-xl bg-[#16A34A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#15803D]"
                        >
                          Save
                        </button>

                        <button
                          type="button"
                          onClick={
                            cancelEdit
                          }
                          className="rounded-xl border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-100"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-xl font-black tracking-tight text-[#111827]">
                        {
                          category.name
                        }
                      </h3>

                      <p className="mt-2 text-sm text-stone-500">
                        Sort order:{" "}
                        {
                          category.sort_order
                        }{" "}
                        ·{" "}
                        {category.is_visible
                          ? "Visible"
                          : "Hidden"}
                      </p>
                    </>
                  )}
                </div>

                {/* ACTIONS */}
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      toggleVisibility(
                        category
                      )
                    }
                    className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm font-semibold text-stone-700 hover:bg-stone-100"
                  >
                    {category.is_visible
                      ? "Hide"
                      : "Show"}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      startEdit(
                        category.id,
                        category.name
                      )
                    }
                    className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm font-semibold text-stone-700 hover:bg-stone-100"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      deleteCategory(
                        category.id
                      )
                    }
                    className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          )
        )}
      </div>
    </section>
  );
}