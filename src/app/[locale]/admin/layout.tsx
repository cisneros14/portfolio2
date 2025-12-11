import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted/40 flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col md:pl-64 transition-all duration-300">
        <AdminHeader />
        <main className="flex-1 p-6 overflow-y-auto bg-card">{children}</main>
      </div>
    </div>
  );
}
