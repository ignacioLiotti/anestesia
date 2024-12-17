// src/app/(dashboard)/forms/[id]/summary/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { SummaryLayoutEditor } from "@/components/summary/SummaryLayoutEditor";
import {
  STYLE_PRESETS,
  getDummyValue,
} from "@/components/summary/items/SummaryItems";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFormList } from "@/hooks/useFormLists";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Props {
  params: {
    id: string;
  };
  searchParams: {
    data?: string;
  };
}

export default function SummaryPage({ params, searchParams }: Props) {
  const { getFormById } = useFormList();
  const [formData, setFormData] = useState<any>(null);
  const [stylePreset, setStylePreset] = useState("default");
  const [layout, setLayout] = useState<any[]>([]);

  // Load form and response data
  useEffect(() => {
    const form = getFormById(params.id);
    if (form) {
      // Parse form response data from URL if present
      const responseData = searchParams.data
        ? JSON.parse(decodeURIComponent(searchParams.data))
        : generateDummyResponses(form);

      setFormData({
        form,
        responses: responseData,
      });
    }
  }, [params.id, searchParams.data, getFormById]);

  // Generate dummy responses for preview
  const generateDummyResponses = (form: any) => {
    const responses: Record<string, any> = {};
    form.steps.forEach((step: any) => {
      step.questions.forEach((question: any) => {
        responses[question.id] = getDummyValue(question.type);
      });
    });
    return responses;
  };

  const handleLayoutChange = (newLayout: any) => {
    setLayout(newLayout);
  };

  const handleStyleChange = (style: string) => {
    setStylePreset(style);
  };

  if (!formData) return null;

  return (
    <div className="space-y-8 p-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            {formData.form.title} - Summary
          </h1>
          <p className="text-muted-foreground">
            Customize how your form responses are displayed
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={stylePreset} onValueChange={handleStyleChange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select style" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(STYLE_PRESETS).map(([key, preset]) => (
                <SelectItem key={key} value={key}>
                  {preset.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button>Save Layout</Button>
          <Button>Export PDF</Button>
        </div>
      </div>

      <div className="grid grid-cols-6 gap-6">
        {/* Layout Editor */}
        <div className="col-span-4 space-y-4">
          <SummaryLayoutEditor
            formData={formData}
            onLayoutChange={handleLayoutChange}
          />
        </div>

        {/* Available Items Panel */}
        <div className="col-span-2">
          <div className="sticky top-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Available Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {formData.form.steps.map((step: any) => (
                    <div key={step.title} className="space-y-2">
                      <h3 className="font-semibold text-sm text-muted-foreground">
                        {step.title}
                      </h3>
                      <div className="space-y-2">
                        {step.questions.map((question: any) => (
                          <div
                            key={question.id}
                            className="p-2 bg-secondary rounded-md cursor-move"
                            draggable
                          >
                            <p className="text-sm font-medium">
                              {question.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formData.responses[question.id]}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Preview Summary</Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Summary Preview</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            {layout.map((section) => (
              <div key={section.id} className="mb-6">
                <h2 className="text-xl font-semibold mb-4">{section.title}</h2>
                <div className={`grid grid-cols-${section.columns} gap-4`}>
                  {section.items.map((item: any) => (
                    <div
                      key={item.id}
                      className={
                        STYLE_PRESETS[stylePreset as keyof typeof STYLE_PRESETS]
                          .styles[item.type].className
                      }
                    >
                      <h3 className="font-medium">{item.title}</h3>
                      <p>{formData.responses[item.id]}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Helper component for section headings
function SectionHeading({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2 my-4">
      <div className="h-px flex-1 bg-border" />
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}
