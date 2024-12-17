// src/hooks/forms/useFormList.ts
import { useEffect, useState, useCallback } from "react";

interface Form {
  id: string;
  title: string;
  description?: string;
  steps: FormStep[];
  createdAt: Date;
  updatedAt: Date;
  isPublished: boolean;
  createdBy: string;
}

interface FormStep {
  id: string;
  title: string;
  order: number;
  questions: Question[];
}

interface Question {
  id: string;
  title: string;
  type: QuestionType;
  options?: string[];
  required: boolean;
  order: number;
}

type QuestionType =
  | "TEXT"
  | "LIST"
  | "MULTIPLE_CHOICE"
  | "PARAGRAPH_TEXT"
  | "SELECT";

const FORMS_STORAGE_KEY = "medical_forms";

export function useFormList() {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load forms from localStorage on mount
  useEffect(() => {
    try {
      const storedForms = localStorage.getItem(FORMS_STORAGE_KEY);
      if (storedForms) {
        // Parse dates properly from JSON
        const parsedForms = JSON.parse(storedForms, (key, value) => {
          if (key === "createdAt" || key === "updatedAt") {
            return new Date(value);
          }
          return value;
        });
        setForms(parsedForms);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to load forms"));
    } finally {
      setLoading(false);
    }
  }, []);

  // Save forms to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem(FORMS_STORAGE_KEY, JSON.stringify(forms));
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to save forms")
        );
      }
    }
  }, [forms, loading]);

  const createForm = useCallback(
    (formData: Omit<Form, "id" | "createdAt" | "updatedAt">) => {
      const newForm: Form = {
        ...formData,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setForms((prev) => [...prev, newForm]);
      return newForm;
    },
    []
  );

  const updateForm = useCallback((id: string, updates: Partial<Form>) => {
    setForms((prev) => {
      const index = prev.findIndex((form) => form.id === id);
      if (index === -1) return prev;

      const updatedForms = [...prev];
      updatedForms[index] = {
        ...updatedForms[index],
        ...updates,
        updatedAt: new Date(),
      };

      return updatedForms;
    });
    // The useEffect in useFormList will handle the localStorage save
    return true;
  }, []);

  const deleteForm = useCallback((id: string) => {
    setForms((prev) => prev.filter((form) => form.id !== id));
    return true;
  }, []);

  const getFormById = useCallback(
    (id: string) => {
      return forms.find((form) => form.id === id) || null;
    },
    [forms]
  );

  const publishForm = useCallback(
    (id: string) => {
      updateForm(id, { isPublished: true });
    },
    [updateForm]
  );

  const unpublishForm = useCallback(
    (id: string) => {
      updateForm(id, { isPublished: false });
    },
    [updateForm]
  );

  // Get recent forms - useful for dashboard
  const getRecentForms = useCallback(
    (limit: number = 5) => {
      return [...forms]
        .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
        .slice(0, limit);
    },
    [forms]
  );

  // Get form statistics
  const getFormStats = useCallback(() => {
    const total = forms.length;
    const published = forms.filter((f) => f.isPublished).length;
    const drafts = total - published;

    return {
      total,
      published,
      drafts,
    };
  }, [forms]);

  return {
    forms,
    loading,
    error,
    createForm,
    updateForm,
    deleteForm,
    getFormById,
    publishForm,
    unpublishForm,
    getRecentForms,
    getFormStats,
  };
}

// Example usage:
/*
function FormComponent() {
  const { 
    forms, 
    loading, 
    createForm, 
    updateForm, 
    deleteForm,
    getFormStats
  } = useFormList();

  if (loading) return <div>Loading...</div>;

  const handleCreateForm = () => {
    const newForm = createForm({
      title: "New Form",
      description: "Form description",
      steps: [],
      isPublished: false,
      createdBy: "user123"
    });
    console.log("Created form:", newForm);
  };

  const stats = getFormStats();
  console.log("Form stats:", stats);

  return (
    <div>
      <button onClick={handleCreateForm}>Create New Form</button>
      {forms.map(form => (
        <div key={form.id}>
          <h3>{form.title}</h3>
          <button onClick={() => updateForm(form.id, { title: "Updated Title" })}>
            Update
          </button>
          <button onClick={() => deleteForm(form.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
*/
