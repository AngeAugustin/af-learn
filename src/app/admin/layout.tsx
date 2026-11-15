import type { Metadata } from "next";
import type { ReactNode } from "react";
import { requireAdmin } from "@/lib/auth";
import { AdminNav } from "@/components/admin/admin-nav";

export const metadata: Metadata = {
  title: { default: "Back office", template: "%s · Back office" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const admin = await requireAdmin();
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:grid lg:grid-cols-[13rem_1fr] lg:gap-8 lg:px-12 lg:py-10">
      <aside className="mb-6 lg:mb-0">
        <div className="lg:sticky lg:top-24">
          <p className="label-mono mb-3 hidden text-fg-subtle lg:block">Back office</p>
          <AdminNav />
          <p className="mt-6 hidden text-xs leading-relaxed text-fg-subtle lg:block">
            Connecté en tant que <span className="font-medium text-fg-muted">{admin.email}</span>
          </p>
        </div>
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
