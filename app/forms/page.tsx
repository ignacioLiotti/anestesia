"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { FormList } from "@/components/dashboard/Forms/FormList";
import { Toaster } from "@/components/ui/toaster";

export default function FormsPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Forms</h1>
        <Button asChild>
          <Link href="/forms/new">
            <Plus className="mr-2 h-4 w-4" />
            Create New Form
          </Link>
        </Button>
      </div>

      <FormList />
    </div>
  );
}
