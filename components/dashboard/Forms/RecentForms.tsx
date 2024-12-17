import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { useFormList } from "@/hooks/useFormLists";

export function RecentForms() {
  const { forms } = useFormList();
  const recentForms = forms.slice(0, 5); // Show only 5 most recent forms

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Forms</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/forms">
            View all
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentForms.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No forms created yet
            </p>
          ) : (
            recentForms.map((form) => (
              <div
                key={form.id}
                className="flex items-center justify-between py-2"
              >
                <div>
                  <p className="text-sm font-medium">{form.title}</p>
                  <p className="text-sm text-muted-foreground">
                    Created {new Date(form.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/forms/${form.id}/edit`}>Edit</Link>
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
