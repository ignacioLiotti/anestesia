import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Edit2, Eye, Trash2 } from "lucide-react";
import { useFormList } from "@/hooks/useFormLists";

export function FormList() {
  const { forms, deleteForm } = useFormList();
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    const success = await deleteForm(id);
    if (success) {
      toast({
        title: "Form deleted",
        description: "The form has been successfully deleted.",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to delete the form. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (forms.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <p className="text-muted-foreground mb-4">No forms created yet</p>
          <Button asChild>
            <Link href="/forms/new">Create your first form</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {forms.map((form) => (
        <Card key={form.id}>
          <CardHeader>
            <CardTitle>{form.title}</CardTitle>
            <CardDescription>
              Created {new Date(form.createdAt).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/forms/${form.id}/preview`}>
                  <Eye className="h-4 w-4 mr-1" />
                  Preview
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/forms/${form.id}/edit`}>
                  <Edit2 className="h-4 w-4 mr-1" />
                  Edit
                </Link>
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(form.id)}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
