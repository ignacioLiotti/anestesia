import FormEditor from "@/components/dashboard/Forms/FormEditor";

export default function EditFormPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <FormEditor formId={params.id}></FormEditor>
    </div>
  );
}
