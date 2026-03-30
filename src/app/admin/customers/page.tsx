import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { getSession } from "@/lib/auth/session"
import { desc } from "drizzle-orm"
import { redirect } from "next/navigation"

export default async function AdminCustomersPage() {
  const session = await getSession()
  if (!session || session.role !== "admin") {
    redirect("/login")
  }

  const customers = await db.query.users.findMany({
    where: (u, { eq }) => eq(u.role, "customer"),
    orderBy: [desc(users.createdAt)],
    columns: {
      id: true,
      name: true,
      phone: true,
      email: true,
      createdAt: true,
    },
  })

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-headline-lg text-on-surface">Customers</h1>
        <p className="text-body-sm text-on-surface-variant mt-0.5">
          {customers.length} registered customer{customers.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="rounded-2xl bg-surface-container-lowest shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container">
                {["Name", "Phone", "Email", "Joined"].map((h) => (
                  <th key={h} className="px-6 py-3 text-label-sm text-on-surface-variant font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-10 text-center text-on-surface-variant text-body-md"
                  >
                    No customers yet.
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="hover:bg-surface-container transition-colors"
                  >
                    <td className="px-6 py-3.5 text-body-sm font-medium text-on-surface">
                      {customer.name ?? "—"}
                    </td>
                    <td className="px-6 py-3.5 text-body-sm text-on-surface-variant font-mono">
                      {customer.phone}
                    </td>
                    <td className="px-6 py-3.5 text-body-sm text-on-surface-variant">
                      {customer.email ?? "—"}
                    </td>
                    <td className="px-6 py-3.5 text-body-sm text-on-surface-variant">
                      {new Date(customer.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
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
