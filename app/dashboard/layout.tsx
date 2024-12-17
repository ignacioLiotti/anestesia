// import { DashboardNav } from "@/components/dashboard/Navigation/DashboardNav";
// import { DashboardHeader } from "@/components/dashboard/Navigation/DashboardHeader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {/* <DashboardHeader /> */}
      <div className="flex h-screen overflow-hidden">
        {/* <DashboardNav /> */}
        <main className="flex-1 overflow-y-auto pt-16 pb-8 md:pt-4 px-4 md:px-8">
          <div className="h-full max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
