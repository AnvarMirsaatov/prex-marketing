import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { AdminNav } from "../admin-nav";
import { AdminTopbar } from "@/components/admin/topbar";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const role = (session.role || "").toUpperCase();
  if (role === "ADMIN") {
    const headersList = await headers();
    const pathname = headersList.get("x-pathname") || "";
    if (pathname && pathname.startsWith("/admin") && pathname !== "/admin/leads" && pathname !== "/admin/security") {
      redirect("/admin/leads");
    }
  }

  return (
    <div className="flex w-full min-h-screen">
      <AdminNav />
      <main className="flex-1 flex flex-col min-w-0 bg-[#070e1c]/70 overflow-y-auto">
        <AdminTopbar />
        <div className="p-4 sm:p-6 lg:p-8 pt-20 lg:pt-6 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
