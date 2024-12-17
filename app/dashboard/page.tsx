"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { RecentForms } from "@/components/dashboard/Forms/RecentForms";
import DashboardMetrics from "@/components/dashboard/DashboardMetrics";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button asChild>
          <Link href="/forms/new">
            <Plus className="mr-2 h-4 w-4" />
            Create New Form
          </Link>
        </Button>
      </div>

      <DashboardMetrics />
      <RecentForms />
    </div>
  );
}
