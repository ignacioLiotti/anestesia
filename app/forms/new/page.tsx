"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MedicalQuestionnaire } from "@/components/MedicalQuestionnaire/MedicalQuestionnaire";
import { Form } from "react-hook-form";
import FormEditor from "@/components/dashboard/Forms/FormEditor";

export default function NewFormPage() {
  return (
    <div>
      <FormEditor />
    </div>
  );
}
