import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Grip, GripVertical } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Main Summary Editor Page Component
export function SummaryPage({ formData }) {
  const [layout, setLayout] = useState([
    {
      id: "section-1",
      title: "Patient Information",
      items: [],
      columns: 2,
    },
  ]);

  const handleDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    // Handling drag from available items to sections
    if (source.droppableId === "available-items") {
      const questionItem = formData.form.steps
        .flatMap((step) => step.questions)
        .find((q) => q.id === draggableId);

      if (!questionItem) return;

      const newItem = {
        id: `${draggableId}-${Date.now()}`,
        type: "text",
        title: questionItem.title,
        questionId: draggableId,
        value: formData.responses[draggableId],
      };

      const newLayout = layout.map((section) => {
        if (section.id === destination.droppableId) {
          return {
            ...section,
            items: [...section.items, newItem],
          };
        }
        return section;
      });

      setLayout(newLayout);
      return;
    }

    // Handling drag between sections
    const sourceSection = layout.find((s) => s.id === source.droppableId);
    const destSection = layout.find((s) => s.id === destination.droppableId);

    if (!sourceSection || !destSection) return;

    const newLayout = [...layout];
    const sourceItems = Array.from(sourceSection.items);
    const destItems = Array.from(destSection.items);

    if (source.droppableId === destination.droppableId) {
      // Reordering within the same section
      const [removed] = sourceItems.splice(source.index, 1);
      sourceItems.splice(destination.index, 0, removed);
      newLayout.forEach((section) => {
        if (section.id === source.droppableId) {
          section.items = sourceItems;
        }
      });
    } else {
      // Moving between sections
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      newLayout.forEach((section) => {
        if (section.id === source.droppableId) {
          section.items = sourceItems;
        }
        if (section.id === destination.droppableId) {
          section.items = destItems;
        }
      });
    }

    setLayout(newLayout);
  };

  const addNewSection = () => {
    setLayout([
      ...layout,
      {
        id: `section-${layout.length + 1}`,
        title: `New Section`,
        items: [],
        columns: 2,
      },
    ]);
  };

  const updateSectionTitle = (sectionId, newTitle) => {
    setLayout(
      layout.map((section) =>
        section.id === sectionId ? { ...section, title: newTitle } : section
      )
    );
  };

  const updateSectionColumns = (sectionId, columns) => {
    setLayout(
      layout.map((section) =>
        section.id === sectionId
          ? { ...section, columns: parseInt(columns) }
          : section
      )
    );
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-4 gap-6">
        {/* Main Layout Area */}
        <div className="col-span-3">
          <div className="space-y-4">
            {layout.map((section) => (
              <Card key={section.id} className="mb-4">
                <CardHeader className="flex flex-row items-center justify-between">
                  <input
                    type="text"
                    value={section.title}
                    onChange={(e) =>
                      updateSectionTitle(section.id, e.target.value)
                    }
                    className="text-xl font-semibold bg-transparent border-none focus:outline-none"
                  />
                  <Select
                    value={section.columns.toString()}
                    onValueChange={(value) =>
                      updateSectionColumns(section.id, value)
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select columns" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? "Column" : "Columns"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardHeader>
                <CardContent>
                  <Droppable droppableId={section.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`grid gap-4 min-h-[100px] p-4 rounded-lg border-2 border-dashed transition-colors
                          ${
                            snapshot.isDraggingOver
                              ? "bg-secondary/50"
                              : "bg-background"
                          }
                          grid-cols-${section.columns}`}
                      >
                        {section.items.map((item, index) => (
                          <Draggable
                            key={item.id}
                            draggableId={item.id}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`p-4 rounded-lg border bg-card ${
                                  snapshot.isDragging ? "shadow-lg" : ""
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                                  <div>
                                    <h3 className="font-medium">
                                      {item.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                      {formData.responses[item.questionId]}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </CardContent>
              </Card>
            ))}

            <Button
              variant="outline"
              onClick={addNewSection}
              className="w-full py-8 border-dashed"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Section
            </Button>
          </div>
        </div>

        {/* Available Items Panel */}
        <div className="col-span-1">
          <AvailableItemsPanel formData={formData} />
        </div>
      </div>
    </DragDropContext>
  );
}

// Available Items Panel Component
export function AvailableItemsPanel({ formData }) {
  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle>Available Items</CardTitle>
      </CardHeader>
      <CardContent>
        <Droppable droppableId="available-items" isDropDisabled={true}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="space-y-4"
            >
              {formData.form.steps.map((step, stepIndex) => (
                <div key={step.title} className="space-y-2">
                  <h3 className="font-semibold text-sm text-muted-foreground">
                    {step.title}
                  </h3>
                  <div className="space-y-2">
                    {step.questions.map((question, index) => (
                      <Draggable
                        key={question.id}
                        draggableId={question.id}
                        index={stepIndex * 100 + index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`p-2 bg-secondary rounded-md cursor-move
                              ${
                                snapshot.isDragging
                                  ? "ring-2 ring-primary shadow-lg"
                                  : ""
                              }`}
                          >
                            <div className="flex items-center gap-2">
                              <Grip className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <p className="text-sm font-medium">
                                  {question.title}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {formData.responses[question.id]}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  </div>
                </div>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </CardContent>
    </Card>
  );
}
