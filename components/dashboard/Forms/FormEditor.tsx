"use client";

import React, { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd"; // or "react-beautiful-dnd"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Grip, GripVertical } from "lucide-react";
import { MedicalQuestionnaire } from "@/components/MedicalQuestionnaire/MedicalQuestionnaire";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useFormList } from "@/hooks/useFormLists";
import Link from "next/link";

interface Question {
  id: string;
  title: string;
  type: string;
  options?: string[];
}

interface Step {
  title: string;
  questions: Question[];
}

const initialQuestionsBank: Question[] = [
  { id: "q-1", title: "Nombre", type: "TEXT" },
  { id: "q-2", title: "Edad", type: "TEXT" },
  { id: "q-3", title: "Peso", type: "TEXT" },
  { id: "q-4", title: "Habitación", type: "TEXT" },
  {
    id: "q-5",
    title: "¿Padece alguna enfermedad del corazón?",
    type: "LIST",
  },
  {
    id: "q-6",
    title: "Pregunta de opción múltiple",
    type: "MULTIPLE_CHOICE",
    options: ["Opción 1", "Opción 2", "Opción 3"],
  },
  {
    id: "q-7",
    title: "Mallampati",
    type: "SELECT",
    options: ["1", "2", "3", "4"],
  },
  {
    id: "q-8",
    title: "Otros (Laboratorio)",
    type: "PARAGRAPH_TEXT",
  },
];

const initialSteps: Step[] = [
  {
    title: "Información Personal",
    questions: [],
  },
  {
    title: "Condiciones Médicas",
    questions: [],
  },
  {
    title: "Examen Físico",
    questions: [],
  },
  {
    title: "Laboratorio",
    questions: [],
  },
];

export default function FormEditor({ formId }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const { createForm, updateForm, getFormById } = useFormList();

  // Form metadata
  const [formTitle, setFormTitle] = useState("Nuevo Formulario");

  // Steps and questions state
  const [steps, setSteps] = useState<Step[]>(initialSteps);
  const [questionsBank, setQuestionsBank] =
    useState<Question[]>(initialQuestionsBank);

  // States for new question creation
  const [newQuestionTitle, setNewQuestionTitle] = useState("");
  const [newQuestionType, setNewQuestionType] = useState("TEXT");
  const [newQuestionOptions, setNewQuestionOptions] = useState<string[]>([]);
  const [newOption, setNewOption] = useState("");

  // UI states
  const [showMedicalQuestionnaire, setShowMedicalQuestionnaire] =
    useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Load existing form data if editing
  useEffect(() => {
    if (formId) {
      const existingForm = getFormById(formId);
      if (existingForm) {
        setFormTitle(existingForm.title);
        setSteps(existingForm.steps);
      } else {
        toast({
          title: "Error",
          description: "Form not found",
          variant: "destructive",
        });
        // router.push("/forms");
      }
    }
  }, [formId, getFormById, router, toast]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const formData = {
        title: formTitle,
        steps,
        isPublished: false,
        createdBy: "user123", // This will be replaced with actual user ID when auth is implemented
      };

      if (formId) {
        // Directly call updateForm without await since it's synchronous
        updateForm(formId, formData);
        toast({
          title: "Success",
          description: "Form updated successfully",
        });
      } else {
        // Create is also synchronous
        const newForm = createForm(formData);
        toast({
          title: "Success",
          description: "Form created successfully",
        });
        router.push(`/forms/${newForm.id}/edit`);
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to save form",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination, type } = result;

    // If no destination or dropped outside droppable area
    if (!destination) return;

    // If dropped in the same place
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // Handle step reordering if type is STEP
    if (type === "STEP") {
      const newSteps = [...steps];
      const [removedStep] = newSteps.splice(source.index, 1);
      newSteps.splice(destination.index, 0, removedStep);
      setSteps(newSteps);
      return;
    }

    // From here on, handle questions dragging
    // Handle drop from Questions Bank to a Step
    if (source.droppableId === "questionsBank") {
      const draggedQuestion = filteredQuestions[source.index];
      // Clone with a unique ID
      const newQuestion = {
        ...draggedQuestion,
        id: `${draggedQuestion.id}-${Date.now()}`,
      };

      const stepIndex = parseInt(destination.droppableId.replace("step-", ""));
      const newSteps = [...steps];
      newSteps[stepIndex].questions.splice(destination.index, 0, newQuestion);
      setSteps(newSteps);
      return;
    }

    // Handle rearranging questions within or between steps
    const startStepIndex = parseInt(source.droppableId.replace("step-", ""));
    const endStepIndex = parseInt(destination.droppableId.replace("step-", ""));

    const newSteps = [...steps];
    const [removed] = newSteps[startStepIndex].questions.splice(
      source.index,
      1
    );
    newSteps[endStepIndex].questions.splice(destination.index, 0, removed);
    setSteps(newSteps);
  };

  const handleAddQuestion = () => {
    if (!newQuestionTitle) return;
    const newQ: Question = {
      id: `new-${Date.now()}`,
      title: newQuestionTitle,
      type: newQuestionType,
      options:
        newQuestionType === "SELECT" || newQuestionType === "MULTIPLE_CHOICE"
          ? newQuestionOptions
          : undefined,
    };
    setQuestionsBank((prev) => [...prev, newQ]);
    setNewQuestionTitle("");
    setNewQuestionType("TEXT");
    setNewQuestionOptions([]);
  };

  const addOption = () => {
    if (!newOption) return;
    setNewQuestionOptions((prev) => [...prev, newOption]);
    setNewOption("");
  };

  const handleAddStep = () => {
    const newStep: Step = {
      title: `Nueva Sección ${steps.length + 1}`,
      questions: [],
    };
    setSteps((prev) => [...prev, newStep]);
  };

  const handleChangeStepTitle = (index: number, newTitle: string) => {
    const updatedSteps = [...steps];
    updatedSteps[index].title = newTitle;
    setSteps(updatedSteps);
  };

  const filteredQuestions = questionsBank.filter((q) =>
    q.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-screen flex flex-col">
      <div className="p-4 border-b flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/forms">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Forms
            </Link>
          </Button>
          <Input
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            className="text-2xl font-bold border-none focus-visible:ring-0 w-[300px]"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleAddStep}>
            Agregar nueva sección
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowMedicalQuestionnaire((prev) => !prev)}
          >
            {showMedicalQuestionnaire ? "Mostrar Editor" : "Preview"}
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      {showMedicalQuestionnaire ? (
        <MedicalQuestionnaire propSteps={steps} />
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex flex-1 bg-slate-100">
            {/* Sidebar */}
            <div className="w-1/4 bg-white border-r p-4 overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">Banco de preguntas</h2>
              <div className="mb-4">
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar pregunta..."
                />
              </div>
              <Droppable
                droppableId="questionsBank"
                isCombineEnabled={false}
                isDropDisabled={false}
                type="QUESTION"
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="space-y-2"
                  >
                    {filteredQuestions.map((q, index) => (
                      <Draggable key={q.id} draggableId={q.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            className={`p-2 border rounded bg-slate-50 cursor-grab flex justify-between items-center ${
                              snapshot.isDragging ? "bg-indigo-100" : ""
                            }`}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <div>
                              <div className="font-medium">{q.title}</div>
                              <div className="text-xs text-gray-500">
                                {q.type}
                              </div>
                            </div>
                            <GripVertical />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

              <div className="mt-6 pt-4 border-t">
                <h3 className="text-lg font-semibold mb-2">
                  Agregar nueva pregunta
                </h3>
                <div className="mb-2">
                  <Label className="mb-1">Título</Label>
                  <Input
                    value={newQuestionTitle}
                    onChange={(e) => setNewQuestionTitle(e.target.value)}
                    placeholder="Título de la pregunta"
                  />
                </div>
                <div className="mb-2">
                  <Label className="mb-1">Tipo</Label>
                  <Select
                    value={newQuestionType}
                    onValueChange={setNewQuestionType}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TEXT">Texto simple</SelectItem>
                      <SelectItem value="LIST">Sí/No</SelectItem>
                      <SelectItem value="MULTIPLE_CHOICE">
                        Múltiple selección
                      </SelectItem>
                      <SelectItem value="PARAGRAPH_TEXT">
                        Texto largo
                      </SelectItem>
                      <SelectItem value="SELECT">Seleccionar uno</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(newQuestionType === "MULTIPLE_CHOICE" ||
                  newQuestionType === "SELECT") && (
                  <div className="mb-2">
                    <Label className="mb-1">Opciones</Label>
                    {newQuestionOptions.map((o, i) => (
                      <div
                        key={i}
                        className="text-sm bg-gray-100 px-2 py-1 rounded mb-1"
                      >
                        {o}
                      </div>
                    ))}
                    <div className="flex items-center space-x-2">
                      <Input
                        value={newOption}
                        onChange={(e) => setNewOption(e.target.value)}
                        placeholder="Nueva opción"
                      />
                      <Button onClick={addOption}>Agregar</Button>
                    </div>
                  </div>
                )}

                <Button onClick={handleAddQuestion} className="mt-2">
                  Añadir al banco
                </Button>
              </div>
            </div>

            {/* Main content */}
            <div className="flex-1 p-4 overflow-y-auto bg-white border rounded-xl mt-5 mx-24">
              <h2 className="text-2xl font-bold mb-4">
                Secciones del Formulario
              </h2>
              <Droppable droppableId="stepsDroppable" type="STEP">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {steps.map((step, sIndex) => (
                      <Draggable
                        key={step.title}
                        draggableId={step.title}
                        index={sIndex}
                      >
                        {(providedStep, snapshotStep) => (
                          <div
                            ref={providedStep.innerRef}
                            {...providedStep.draggableProps}
                            className={`mb-8 border rounded-lg p-4 ${
                              snapshotStep.isDragging ? "bg-indigo-50" : ""
                            }`}
                          >
                            <div
                              className="flex items-center mb-2"
                              {...providedStep.dragHandleProps}
                            >
                              <Input
                                className="flex-1 border-none md:text-2xl p-0 h-10"
                                value={step.title}
                                onChange={(e) =>
                                  handleChangeStepTitle(sIndex, e.target.value)
                                }
                              />
                            </div>
                            <Droppable
                              droppableId={`step-${sIndex}`}
                              isCombineEnabled={false}
                              isDropDisabled={false}
                              type="QUESTION"
                            >
                              {(providedQ) => (
                                <div
                                  ref={providedQ.innerRef}
                                  {...providedQ.droppableProps}
                                  className="min-h-[100px] p-4 pb-7 border-2 border-dashed border-gray-300 rounded"
                                >
                                  {step.questions.map((q, index) => (
                                    <Draggable
                                      key={q.id}
                                      draggableId={q.id}
                                      index={index}
                                    >
                                      {(providedQItem, snapshotQItem) => (
                                        <div
                                          className={`p-2 border rounded bg-slate-50 mb-2 flex justify-between items-center ${
                                            snapshotQItem.isDragging
                                              ? "bg-indigo-50"
                                              : ""
                                          }`}
                                          ref={providedQItem.innerRef}
                                          {...providedQItem.draggableProps}
                                          {...providedQItem.dragHandleProps}
                                        >
                                          <div>
                                            <div className="font-medium">
                                              {q.title}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                              {q.type}
                                            </div>
                                          </div>
                                          <GripVertical />
                                        </div>
                                      )}
                                    </Draggable>
                                  ))}
                                  {providedQ.placeholder}
                                </div>
                              )}
                            </Droppable>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </div>
        </DragDropContext>
      )}
    </div>
  );
}
