import { getSuppliersAdmin } from "@/lib/actions/suppliers"
import { Badge } from "@/components/ui/badge"
import { AddSupplierForm } from "./add-supplier-form"

export default async function AdminSuppliersPage() {
  const suppliers = await getSuppliersAdmin()

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-headline-lg text-on-surface">Suppliers</h1>
        <p className="text-body-sm text-on-surface-variant mt-0.5">
          {suppliers.length} supplier{suppliers.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Add supplier form */}
      <div className="rounded-2xl bg-surface-container-lowest shadow-md p-6">
        <h2 className="text-title-md text-on-surface mb-4">Add Supplier</h2>
        <AddSupplierForm />
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-surface-container-lowest shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container">
                {["Name", "Phone", "WhatsApp", "Email", "Type", "Active"].map((h) => (
                  <th key={h} className="px-6 py-3 text-label-sm text-on-surface-variant font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {suppliers.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-on-surface-variant text-body-md"
                  >
                    No suppliers yet. Add one above.
                  </td>
                </tr>
              ) : (
                suppliers.map((supplier) => (
                  <tr
                    key={supplier.id}
                    className="hover:bg-surface-container transition-colors"
                  >
                    <td className="px-6 py-3.5 text-body-sm font-medium text-on-surface">
                      {supplier.name}
                    </td>
                    <td className="px-6 py-3.5 text-body-sm text-on-surface-variant font-mono">
                      {supplier.phone ?? "—"}
                    </td>
                    <td className="px-6 py-3.5 text-body-sm text-on-surface-variant font-mono">
                      {supplier.whatsapp ?? "—"}
                    </td>
                    <td className="px-6 py-3.5 text-body-sm text-on-surface-variant">
                      {supplier.email ?? "—"}
                    </td>
                    <td className="px-6 py-3.5">
                      <Badge variant={supplier.type === "direct" ? "default" : "tertiary"}>
                        {supplier.type === "direct" ? "Direct" : "Platform"}
                      </Badge>
                    </td>
                    <td className="px-6 py-3.5">
                      <Badge variant={supplier.isActive ? "success" : "error"}>
                        {supplier.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
