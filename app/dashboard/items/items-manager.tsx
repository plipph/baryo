"use client";

import { createClient } from "@/lib/supabase/client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { uploadImage } from "@/lib/upload";
import { Link } from "lucide-react";


type Category = {
  id: string;
  business_id: string;
  name: string;
  sort_order: number;
  is_visible: boolean;
};

type Item = {
  id: string;
  business_id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  price: number | null;
  image_url: string | null;
  sort_order: number;
  is_visible: boolean;
  categories?: {
    id: string;
    name: string;
  } | null;
};

type ItemsManagerProps = {
  businessId: string;
  businessPlan: string;
  categories: Category[];
  initialItems: Item[];
};

export function ItemsManager({
  businessId,
  businessPlan,
  categories,
  initialItems,
}: ItemsManagerProps) {
  const router = useRouter();
  const supabase = createClient();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editCategoryId, setEditCategoryId] = useState("");
  const [editSortOrder, setEditSortOrder] = useState(0);
  const [editImageUrl, setEditImageUrl] = useState("");
  const [uploadingEditImage, setUploadingEditImage] = useState(false);

  const ITEM_LIMITS = {
  libre: 10,
  pro: Infinity,
  premium: Infinity,
};

const currentLimit =
  ITEM_LIMITS[
    businessPlan as keyof typeof ITEM_LIMITS
  ] ?? 10;

const libreLimitReached =
  initialItems.length >= currentLimit;

    async function handleItemImageUpload(file: File | null) {
  if (!file) return;

  try {
    setUploadingImage(true);
    setMessage("");

    const publicUrl = await uploadImage({
      supabase,
      bucket: "item-images",
      file,
      folder: `${businessId}/items`,
    });

    setImageUrl(publicUrl);
  } catch (error) {
    setMessage(error instanceof Error ? error.message : "Image upload failed.");
  } finally {
    setUploadingImage(false);
  }
}



  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    if (!name.trim()) {
      setMessage("Item name is required.");
      setLoading(false);
      return;
    }

    if (libreLimitReached) {
     setMessage(`You have reached the ${currentLimit} item limit. Upgrade your plan to add more items.`);
      setLoading(false);
      return;
    }

    const numericPrice = price ? Number(price) : null;

    if (price && Number.isNaN(numericPrice)) {
      setMessage("Price must be a valid number.");
      setLoading(false);
      return;
    }

   const { error } = await supabase.from("items").insert({
  business_id: businessId,
  category_id: categoryId || null,
  name: name.trim(),
  description: description.trim() || null,
  price: numericPrice,
  image_url: imageUrl || null,
  sort_order: sortOrder,
  is_visible: true,
});

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }
    setImageUrl("");
    setName("");
    setDescription("");
    setPrice("");
    setCategoryId("");
    setSortOrder(0);
    setLoading(false);
    router.refresh();
  }

  async function toggleVisibility(item: Item) {
    const { error } = await supabase
      .from("items")
      .update({ is_visible: !item.is_visible })
      .eq("id", item.id);

    if (error) {
      setMessage(error.message);
      return;
    }

    router.refresh();
  }

  async function deleteItem(itemId: string) {
    const confirmed = window.confirm("Delete this item?");

    if (!confirmed) return;

    const { error } = await supabase.from("items").delete().eq("id", itemId);

    if (error) {
      setMessage(error.message);
      return;
    }

    router.refresh();
  }

  function startEdit(item: Item) {
  setEditingItem(item);
  setEditName(item.name);
  setEditDescription(item.description || "");
  setEditPrice(item.price !== null ? String(item.price) : "");
  setEditCategoryId(item.category_id || "");
  setEditSortOrder(item.sort_order);
  setEditImageUrl(item.image_url || "");
  setMessage("");
}

function cancelEdit() {
  setEditingItem(null);
  setEditName("");
  setEditDescription("");
  setEditPrice("");
  setEditCategoryId("");
  setEditSortOrder(0);
  setEditImageUrl("");
}

async function handleEditImageUpload(file: File | null) {
  if (!file) return;

  try {
    setUploadingEditImage(true);
    setMessage("");

    const publicUrl = await uploadImage({
      supabase,
      bucket: "item-images",
      file,
      folder: `${businessId}/items`,
    });

    setEditImageUrl(publicUrl);
  } catch (error) {
    setMessage(error instanceof Error ? error.message : "Image upload failed.");
  } finally {
    setUploadingEditImage(false);
  }
}

async function saveEdit() {
  if (!editingItem) return;

  setMessage("");

  if (!editName.trim()) {
    setMessage("Item name is required.");
    return;
  }

  const numericPrice = editPrice ? Number(editPrice) : null;

  if (editPrice && Number.isNaN(numericPrice)) {
    setMessage("Price must be a valid number.");
    return;
  }

  const { error } = await supabase
    .from("items")
    .update({
      category_id: editCategoryId || null,
      name: editName.trim(),
      description: editDescription.trim() || null,
      price: numericPrice,
      image_url: editImageUrl || null,
      sort_order: editSortOrder,
    })
    .eq("id", editingItem.id);

  if (error) {
    setMessage(error.message);
    return;
  }

  cancelEdit();
  router.refresh();
}

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.7fr]">
      <form
        onSubmit={handleCreate}
        className="rounded-3xl border border-[#E2D4C2] bg-white/80 p-6 shadow-sm"
      >
        <h2 className="text-xl font-bold text-[#3D2A1E]">Add Item</h2>
        <p className="mt-2 text-sm text-stone-600">
          Add menu items, services, rooms, packages, or products.
        </p>

        {libreLimitReached && (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
           You reached your plan limit of {currentLimit} items.
            Upgrade to Pro or Premium for unlimited products and services.
          </div>
        )}

        <div className="mt-5 space-y-4">
          <div>
            <label className="text-sm font-medium text-stone-700">
              Item name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-[#C85A32]"
              placeholder="Chicken Inasal"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-stone-700">
              Category
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 outline-none focus:border-[#C85A32]"
            >
              <option value="">Uncategorized</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-stone-700">
              Price
            </label>
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              type="number"
              step="0.01"
              className="mt-1 w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-[#C85A32]"
              placeholder="120"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-stone-700">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="mt-1 w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-[#C85A32]"
              placeholder="Short description of the item."
            />
          </div>


<div>
  <label className="text-sm font-medium text-stone-700">
    Item image
  </label>

  <div className="mt-1 rounded-2xl border border-stone-300 bg-white p-4">
    {imageUrl ? (
      <img
        src={imageUrl}
        alt="Item preview"
        className="mb-3 h-32 w-full rounded-2xl object-cover"
      />
    ) : (
      <div className="mb-3 flex h-32 w-full items-center justify-center rounded-2xl bg-[#E9D8C0] text-xs text-[#8A6A4F]">
        No image
      </div>
    )}

    <label className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-[#C85A32] px-4 py-2 text-sm font-semibold text-white hover:bg-[#A94727]">
      Upload Item Image
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(event) =>
          handleItemImageUpload(event.target.files?.[0] || null)
        }
        className="hidden"
      />
    </label>

    <p className="mt-2 text-xs text-stone-500">
      JPG, PNG, or WebP. Max 5 MB.
    </p>

    {uploadingImage && (
      <p className="mt-2 text-sm text-[#C85A32]">Uploading image...</p>
    )}
  </div>
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
            disabled={loading || libreLimitReached}
            className="w-full rounded-2xl bg-[#C85A32] px-5 py-3 font-semibold text-white hover:bg-[#A94727] disabled:opacity-60"
          >
            {loading ? "Adding..." : "Add Item"}
          </button>
        </div>
      </form>

      <section className="rounded-3xl border border-[#E2D4C2] bg-white/80 p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-[#3D2A1E]">Current Items</h2>
           <p className="mt-1 text-sm text-stone-600">
  {initialItems.length}
  {currentLimit !== Infinity &&
    ` / ${currentLimit}`}{" "}
  item
  {initialItems.length === 1
    ? ""
    : "s"}{" "}
  added.
</p>
          </div>

          <span className="rounded-full bg-[#F1E5D4] px-4 py-2 text-sm font-semibold text-[#5A3825]">
            Plan: {businessPlan}
          </span>
        </div>

        
<div className="mt-5 space-y-4"> {initialItems.length === 0 ? ( <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-[#D8C6B3] bg-[#FFF8EF] px-8 py-20 text-center"> <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-sm"> 📦 </div> <h3 className="mt-6 text-3xl font-black tracking-tight text-[#3D2A1E]"> No items yet </h3> <p className="mt-4 max-w-md text-base leading-relaxed text-stone-600"> Add your first product, menu item, or service to start building your storefront experience. </p> <div className="mt-8 flex flex-wrap justify-center gap-3"> <button type="submit" className="rounded-2xl bg-[#C85A32] px-6 py-4 font-semibold text-white shadow-lg transition hover:scale-[1.02]" > Add First Item </button> <Link href="/dashboard/categories" className="rounded-2xl border border-[#D8C6B3] bg-white px-6 py-4 font-semibold text-[#3D2A1E] transition hover:bg-[#F8F4EC]" > Create Categories </Link> </div> </div> ) : ( initialItems.map((item) => (


              <div
                key={item.id}
                className="flex flex-col gap-4 rounded-2xl border border-[#E7D8C5] bg-[#FFF8EF] p-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-[#3D2A1E]">{item.name}</p>

                    <span className="rounded-full bg-white px-3 py-1 text-xs text-stone-600">
                      {item.categories?.name || "Uncategorized"}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs ${
                        item.is_visible
                          ? "bg-green-100 text-green-700"
                          : "bg-stone-200 text-stone-600"
                      }`}
                    >
                      {item.is_visible ? "Visible" : "Hidden"}
                    </span>
                  </div>

                  {item.description && (
                    <p className="mt-1 max-w-xl text-sm text-stone-600">
                      {item.description}
                    </p>
                  )}

                  <p className="mt-2 text-sm font-semibold text-[#596B3F]">
                    {item.price !== null ? `₱${Number(item.price).toFixed(2)}` : "No price"}
                  </p>

                  <p className="mt-1 text-xs text-stone-500">
                    Sort order: {item.sort_order}
                  </p>
                </div>

                <div className="flex gap-2">
<button
  type="button"
  onClick={() => startEdit(item)}
  className="rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm text-stone-700 hover:bg-stone-100"
>
  Edit
</button>

                  <button
                    type="button"
                    onClick={() => toggleVisibility(item)}
                    className="rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm text-stone-700 hover:bg-stone-100"
                  >
                    {item.is_visible ? "Hide" : "Show"}
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteItem(item.id)}
                    className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
                {editingItem && (
  <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-4 pb-4 md:items-center md:pb-0">
    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8A6A4F]">
            Edit Item
          </p>
          <h3 className="mt-2 text-2xl font-bold text-[#3D2A1E]">
            {editingItem.name}
          </h3>
        </div>

        <button
          type="button"
          onClick={cancelEdit}
          className="rounded-full bg-stone-100 px-3 py-1 text-sm font-bold text-stone-600 hover:bg-stone-200"
        >
          ×
        </button>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-stone-700">
            Item name
          </label>
          <input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="mt-1 w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-[#C85A32]"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-stone-700">
            Category
          </label>
          <select
            value={editCategoryId}
            onChange={(e) => setEditCategoryId(e.target.value)}
            className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 outline-none focus:border-[#C85A32]"
          >
            <option value="">Uncategorized</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-stone-700">
            Price
          </label>
          <input
            value={editPrice}
            onChange={(e) => setEditPrice(e.target.value)}
            type="number"
            step="0.01"
            className="mt-1 w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-[#C85A32]"
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-sm font-medium text-stone-700">
            Description
          </label>
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            rows={4}
            className="mt-1 w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-[#C85A32]"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-stone-700">
            Sort order
          </label>
          <input
            value={editSortOrder}
            onChange={(e) => setEditSortOrder(Number(e.target.value))}
            type="number"
            className="mt-1 w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-[#C85A32]"
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-sm font-medium text-stone-700">
            Item image
          </label>

          <div className="mt-1 rounded-2xl border border-stone-300 bg-white p-4">
            {editImageUrl ? (
              <img
                src={editImageUrl}
                alt="Item preview"
                className="mb-3 h-40 w-full rounded-2xl object-cover"
              />
            ) : (
              <div className="mb-3 flex h-40 w-full items-center justify-center rounded-2xl bg-[#E9D8C0] text-xs text-[#8A6A4F]">
                No image
              </div>
            )}

            <label className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-[#C85A32] px-4 py-2 text-sm font-semibold text-white hover:bg-[#A94727]">
              Replace Image
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(event) =>
                  handleEditImageUpload(event.target.files?.[0] || null)
                }
                className="hidden"
              />
            </label>

            {editImageUrl && (
              <button
                type="button"
                onClick={() => setEditImageUrl("")}
                className="ml-2 rounded-xl border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-100"
              >
                Remove Image
              </button>
            )}

            {uploadingEditImage && (
              <p className="mt-2 text-sm text-[#C85A32]">
                Uploading image...
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <button
          type="button"
          onClick={cancelEdit}
          className="rounded-2xl border border-stone-300 bg-white px-5 py-3 font-semibold text-stone-700 hover:bg-stone-100"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={saveEdit}
          className="rounded-2xl bg-[#596B3F] px-5 py-3 font-semibold text-white hover:bg-[#45532F]"
        >
          Save Changes
        </button>
      </div>
    </div>
  </div>
)}
              </div>
              
            ))
          )}
        </div>
      </section>
    </div>
  );
}