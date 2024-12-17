import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

interface AvailableItemsPanelProps {
  formData: any;
  layout: any[];
  setLayout: (layout: any[]) => void;
  onLayoutChange?: (layout: any[]) => void;
}

export function AvailableItemsPanel({
  formData,
  layout,
  setLayout,
  onLayoutChange,
}: AvailableItemsPanelProps) {
  const handleDragEnd = (result: any) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (source.droppableId === "available-items") {
      const questionItem = formData.form.steps
        .flatMap((step: any) => step.questions)
        .find((q: any) => q.id === draggableId);

      if (!questionItem) return;

      const newItem = {
        id: `${draggableId}-${Date.now()}`,
        type: "text",
        title: questionItem.title,
        questionId: questionItem.id,
        value: formData.responses[questionItem.id],
        width: 1,
      };

      const updatedLayout = layout.map((section: any) => {
        if (section.id === destination.droppableId) {
          const newItems = Array.from(section.items);
          newItems.splice(destination.index, 0, newItem);
          return { ...section, items: newItems };
        }
        return section;
      });

      setLayout(updatedLayout);
      onLayoutChange && onLayoutChange(updatedLayout);
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const section = layout.find((s) => s.id === source.droppableId);
      if (!section) return;

      const newItems = Array.from(section.items);
      const [removed] = newItems.splice(source.index, 1);
      newItems.splice(destination.index, 0, removed);

      const newLayout = layout.map((s) =>
        s.id === source.droppableId ? { ...s, items: newItems } : s
      );

      setLayout(newLayout);
      onLayoutChange && onLayoutChange(newLayout);
    } else {
      const sourceSection = layout.find((s) => s.id === source.droppableId);
      const destSection = layout.find((s) => s.id === destination.droppableId);
      if (!sourceSection || !destSection) return;

      const sourceItems = Array.from(sourceSection.items);
      const destItems = Array.from(destSection.items);
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);

      const newLayout = layout.map((section) => {
        if (section.id === source.droppableId) {
          return { ...section, items: sourceItems };
        }
        if (section.id === destination.droppableId) {
          return { ...section, items: destItems };
        }
        return section;
      });

      setLayout(newLayout);
      onLayoutChange && onLayoutChange(newLayout);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Items</CardTitle>
      </CardHeader>
      <CardContent>
        <Droppable droppableId="available-items" isDropDisabled={false}>
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={`space-y-4 ${
                snapshot.isDraggingOver ? "bg-muted/50" : ""
              }`}
            >
              {formData.form.steps.map((step: any, stepIndex: number) => (
                <div key={step.title} className="space-y-2">
                  <h3 className="font-semibold text-sm text-muted-foreground">
                    {step.title}
                  </h3>
                  <div className="space-y-2">
                    {step.questions.map((question: any, index: number) => (
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
                            <p className="text-sm font-medium">
                              {question.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formData.responses[question.id]}
                            </p>
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
