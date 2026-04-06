"use client"

import { useState, useTransition, useCallback } from "react"
import { useRouter } from "next/navigation"
import { createProduct, updateProduct, upsertVariants } from "@/lib/actions/products"
import type { ProductWithVariants, ProductVariant } from "@/lib/actions/products"
import type { Category } from "@/lib/actions/categories"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, AlertCircle } from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

interface VariantRow {
  id?: string // existing variant id (edit mode)
  size: string
  color: string
  colorHex: string
  sku: string
  stock: string
  priceOverride: string // in rupees, blank = use product price
  isActive: boolean
}

interface ProductFormProps {
  categories: Category[]
  product?: ProductWithVariants
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function autoSku(productName: string, size: string, color: string, index: number): string {
  const base = slugify(productName).toUpperCase().slice(0, 6).replace(/-/g, "")
  const s = size.toUpperCase().slice(0, 2)
  const c = color.toUpperCase().slice(0, 2)
  return `${base}-${s}${c}-${String(index + 1).padStart(2, "0")}`
}

function variantFromExisting(v: ProductVariant): VariantRow {
  return {
    id: v.id,
    size: v.size ?? "",
    color: v.color ?? "",
    colorHex: v.colorHex ?? "",
    sku: v.sku,
    stock: String(v.stock),
    priceOverride: v.priceOverride ? String(Math.round(v.priceOverride / 100)) : "",
    isActive: v.isActive,
  }
}

function emptyVariant(): VariantRow {
  return {
    size: "",
    color: "",
    colorHex: "",
    sku: "",
    stock: "0",
    priceOverride: "",
    isActive: true,
  }
}

// ─── Component ───────────────────────────────────────────────────────────────

export function ProductForm({ categories, product }: ProductFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  // Core fields
  const [name, setName] = useState(product?.name ?? "")

  const [slug, setSlug] = useState(product?.slug ?? "")
  const [slugEdited, setSlugEdited] = useState(!!product)
  const [description, setDescription] = useState(product?.description ?? "")
  const [categoryId, setCategoryId] = useState<string>(
    product?.categoryId ? String(product.categoryId) : ""
  )
  const [basePrice, setBasePrice] = useState(
    product ? String(Math.round(product.basePrice / 100)) : ""
  )
  const [salePrice, setSalePrice] = useState(
    product?.salePrice ? String(Math.round(product.salePrice / 100)) : ""
  )
  const [material, setMaterial] = useState(product?.material ?? "")
  const [careInstructions, setCareInstructions] = useState(product?.careInstructions ?? "")
  const [isFeatured, setIsFeatured] = useState(product?.isFeatured ?? false)
  const [isActive, setIsActive] = useState(product?.isActive ?? true)
  const [images, setImages] = useState<string>(
    product?.images?.join("\n") ?? ""
  )

  // Variants
  const [variants, setVariants] = useState<VariantRow[]>(
    product?.variants?.length
      ? product.variants.map(variantFromExisting)
      : [emptyVariant()]
  )

  // Auto-slug from name
  const handleNameChange = useCallback(
    (value: string) => {
      setName(value)
      if (!slugEdited) {
        setSlug(slugify(value))
      }
    },
    [slugEdited]
  )

  // Variant helpers
  function updateVariant<K extends keyof VariantRow>(
    index: number,
    field: K,
    value: VariantRow[K]
  ) {
    setVariants((prev) => {
      const next = prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
      // Re-auto-sku if size or color changed and sku not manually set
      if (field === "size" || field === "color") {
        const row = next[index]
        const originalSku = autoSku(
          name,
          prev[index].size,
          prev[index].color,
          index
        )
        if (row.sku === originalSku || row.sku === "") {
          next[index] = {
            ...next[index],
            sku: autoSku(
              name,
              field === "size" ? String(value) : row.size,
              field === "color" ? String(value) : row.color,
              index
            ),
          }
        }
      }
      return next
    })
  }

  function addVariant() {
    setVariants((prev) => {
      const newRow = emptyVariant()
      newRow.sku = autoSku(name, "", "", prev.length)
      return [...prev, newRow]
    })
  }

  function removeVariant(index: number) {
    setVariants((prev) => prev.filter((_, i) => i !== index))
  }

  // Submit
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const basePricePaisa = Math.round(parseFloat(basePrice) * 100)
    const salePricePaisa = salePrice ? Math.round(parseFloat(salePrice) * 100) : null

    if (isNaN(basePricePaisa) || basePricePaisa <= 0) {
      setError("Please enter a valid base price.")
      return
    }

    const imageList = images
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean)

    const productData = {
      name: name.trim(),
      nameHi: null,
      slug: slug.trim(),
      description: description.trim() || null,
      categoryId: categoryId ? Number(categoryId) : null,
      basePrice: basePricePaisa,
      salePrice: salePricePaisa,
      material: material.trim() || null,
      careInstructions: careInstructions.trim() || null,
      isFeatured,
      isActive,
      images: imageList,
    }

    const variantData = variants
      .filter((v) => v.sku.trim())
      .map((v, i) => ({
        sku: v.sku.trim(),
        size: v.size.trim() || null,
        color: v.color.trim() || null,
        colorHex: v.colorHex.trim() || null,
        stock: parseInt(v.stock, 10) || 0,
        priceOverride: v.priceOverride
          ? Math.round(parseFloat(v.priceOverride) * 100)
          : null,
        isActive: v.isActive,
        productId: product?.id ?? "",
      }))

    startTransition(async () => {
      if (product) {
        const [productResult, variantResult] = await Promise.all([
          updateProduct(product.id, productData),
          upsertVariants(product.id, variantData),
        ])
        if (!productResult.success) {
          setError(productResult.error)
          return
        }
        if (!variantResult.success) {
          setError(variantResult.error)
          return
        }
      } else {
        const result = await createProduct(productData, variantData)
        if (!result.success) {
          setError(result.error)
          return
        }
      }
      router.push("/admin/products")
      router.refresh()
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="flex items-start gap-3 rounded-xl bg-error-container px-4 py-3">
          <AlertCircle className="w-5 h-5 text-on-error-container shrink-0 mt-0.5" />
          <p className="text-body-sm text-on-error-container">{error}</p>
        </div>
      )}

      {/* Core Details */}
      <section className="rounded-2xl bg-surface-container-lowest shadow-md p-6 space-y-5">
        <h2 className="text-title-lg text-on-surface">Product Details</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-label-md text-on-surface-variant" htmlFor="name">
              Name <span className="text-error">*</span>
            </label>
            <input
              id="name"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Anarkali Kurta Set"
              className="w-full h-11 px-4 rounded-xl bg-surface-container text-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-2 focus:outline-primary"
            />
          </div>


          {/* Slug */}
          <div className="space-y-1.5">
            <label className="text-label-md text-on-surface-variant" htmlFor="slug">
              Slug <span className="text-error">*</span>
            </label>
            <input
              id="slug"
              required
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value)
                setSlugEdited(true)
              }}
              placeholder="anarkali-kurta-set"
              className="w-full h-11 px-4 rounded-xl bg-surface-container text-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-2 focus:outline-primary font-mono text-body-sm"
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="text-label-md text-on-surface-variant" htmlFor="category">
              Category
            </label>
            <select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-surface-container text-body-md text-on-surface focus:outline-2 focus:outline-primary"
            >
              <option value="">— No category —</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Base Price */}
          <div className="space-y-1.5">
            <label className="text-label-md text-on-surface-variant" htmlFor="basePrice">
              Base Price (₹) <span className="text-error">*</span>
            </label>
            <input
              id="basePrice"
              type="number"
              min="1"
              step="1"
              required
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
              placeholder="999"
              className="w-full h-11 px-4 rounded-xl bg-surface-container text-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-2 focus:outline-primary"
            />
          </div>

          {/* Sale Price */}
          <div className="space-y-1.5">
            <label className="text-label-md text-on-surface-variant" htmlFor="salePrice">
              Sale Price (₹)
            </label>
            <input
              id="salePrice"
              type="number"
              min="1"
              step="1"
              value={salePrice}
              onChange={(e) => setSalePrice(e.target.value)}
              placeholder="Leave blank if no sale"
              className="w-full h-11 px-4 rounded-xl bg-surface-container text-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-2 focus:outline-primary"
            />
          </div>

          {/* Material */}
          <div className="space-y-1.5">
            <label className="text-label-md text-on-surface-variant" htmlFor="material">
              Material
            </label>
            <input
              id="material"
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              placeholder="e.g. Cotton, Silk"
              className="w-full h-11 px-4 rounded-xl bg-surface-container text-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-2 focus:outline-primary"
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-label-md text-on-surface-variant" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Product description…"
            className="w-full px-4 py-3 rounded-xl bg-surface-container text-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-2 focus:outline-primary resize-y"
          />
        </div>

        {/* Care Instructions */}
        <div className="space-y-1.5">
          <label className="text-label-md text-on-surface-variant" htmlFor="care">
            Care Instructions
          </label>
          <textarea
            id="care"
            rows={2}
            value={careInstructions}
            onChange={(e) => setCareInstructions(e.target.value)}
            placeholder="e.g. Gentle machine wash"
            className="w-full px-4 py-3 rounded-xl bg-surface-container text-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-2 focus:outline-primary resize-y"
          />
        </div>

        {/* Image URLs */}
        <div className="space-y-1.5">
          <label className="text-label-md text-on-surface-variant" htmlFor="images">
            Image URLs (one per line)
          </label>
          <textarea
            id="images"
            rows={3}
            value={images}
            onChange={(e) => setImages(e.target.value)}
            placeholder={"https://example.com/image1.jpg\nhttps://example.com/image2.jpg"}
            className="w-full px-4 py-3 rounded-xl bg-surface-container text-body-sm text-on-surface placeholder:text-on-surface-variant focus:outline-2 focus:outline-primary resize-y font-mono"
          />
        </div>

        {/* Toggles */}
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-3 cursor-pointer min-h-[44px]">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-5 h-5 rounded accent-primary"
            />
            <div>
              <p className="text-body-md text-on-surface">Active</p>
              <p className="text-xs text-on-surface-variant">Visible on storefront</p>
            </div>
          </label>
          <label className="flex items-center gap-3 cursor-pointer min-h-[44px]">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-5 h-5 rounded accent-primary"
            />
            <div>
              <p className="text-body-md text-on-surface">Featured</p>
              <p className="text-xs text-on-surface-variant">Shown on homepage</p>
            </div>
          </label>
        </div>
      </section>

      {/* Variants */}
      <section className="rounded-2xl bg-surface-container-lowest shadow-md p-6 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-title-lg text-on-surface">Variants</h2>
          <Button type="button" variant="secondary" size="sm" onClick={addVariant}>
            <Plus className="w-4 h-4" />
            Add Row
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
            <thead>
              <tr className="bg-surface-container">
                {["Size", "Color", "Hex", "SKU", "Stock", "Override (₹)", "Active", ""].map((h) => (
                  <th key={h} className="px-3 py-2.5 text-label-sm text-on-surface-variant font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {variants.map((row, idx) => (
                <tr key={idx} className="hover:bg-surface-container transition-colors">
                  <td className="px-3 py-2">
                    <input
                      value={row.size}
                      onChange={(e) => updateVariant(idx, "size", e.target.value)}
                      placeholder="M"
                      className="h-9 w-16 px-2 rounded-lg bg-surface-container text-body-sm text-on-surface focus:outline-2 focus:outline-primary"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      value={row.color}
                      onChange={(e) => updateVariant(idx, "color", e.target.value)}
                      placeholder="Red"
                      className="h-9 w-20 px-2 rounded-lg bg-surface-container text-body-sm text-on-surface focus:outline-2 focus:outline-primary"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="color"
                        value={row.colorHex || "#000000"}
                        onChange={(e) => updateVariant(idx, "colorHex", e.target.value)}
                        className="w-8 h-8 rounded cursor-pointer bg-transparent"
                      />
                      <input
                        value={row.colorHex}
                        onChange={(e) => updateVariant(idx, "colorHex", e.target.value)}
                        placeholder="#"
                        maxLength={7}
                        className="h-9 w-20 px-2 rounded-lg bg-surface-container text-xs text-on-surface font-mono focus:outline-2 focus:outline-primary"
                      />
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <input
                      value={row.sku}
                      onChange={(e) => updateVariant(idx, "sku", e.target.value)}
                      placeholder="SKU-001"
                      className="h-9 w-28 px-2 rounded-lg bg-surface-container text-xs text-on-surface font-mono focus:outline-2 focus:outline-primary"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      min="0"
                      value={row.stock}
                      onChange={(e) => updateVariant(idx, "stock", e.target.value)}
                      className="h-9 w-16 px-2 rounded-lg bg-surface-container text-body-sm text-on-surface focus:outline-2 focus:outline-primary"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      min="0"
                      value={row.priceOverride}
                      onChange={(e) => updateVariant(idx, "priceOverride", e.target.value)}
                      placeholder="—"
                      className="h-9 w-24 px-2 rounded-lg bg-surface-container text-body-sm text-on-surface focus:outline-2 focus:outline-primary"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="checkbox"
                      checked={row.isActive}
                      onChange={(e) => updateVariant(idx, "isActive", e.target.checked)}
                      className="w-5 h-5 rounded accent-primary"
                    />
                  </td>
                  <td className="px-3 py-2">
                    {variants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVariant(idx)}
                        className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-error-container text-on-surface-variant hover:text-on-error-container transition-colors"
                        aria-label="Remove variant"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="secondary"
          size="md"
          onClick={() => router.back()}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button type="submit" size="md" disabled={isPending}>
          {isPending ? "Saving…" : product ? "Save Changes" : "Create Product"}
        </Button>
      </div>
    </form>
  )
}
