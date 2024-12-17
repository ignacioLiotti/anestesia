"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { createSnapModifier } from "@dnd-kit/modifiers";
import { Resizable } from "re-resizable";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, GripVertical } from "lucide-react";

// Types
interface Section {
  id: string;
  type: "text" | "pill" | "table";
  title: string;
  content: any;
  width?: number;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
}

// Not used directly, but kept here if needed later
function TextSection({ content, onChange }) {
  return (
    <div className="space-y-2">
      <textarea
        value={content}
        onChange={(e) => onChange(e.target.value)}
        className="w-full min-h-[100px] p-2 border rounded"
        placeholder="Enter text content..."
      />
    </div>
  );
}

function PillContent({ content }) {
  const [items, setItems] = useState(content);
  const [newPill, setNewPill] = useState("");

  const addPill = () => {
    if (newPill.trim()) {
      setItems([...items, newPill.trim()]);
      setNewPill("");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {items.map((pill, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-primary/10 rounded-full text-sm flex items-center"
          >
            {pill}
            <button
              onClick={() => setItems(items.filter((_, i) => i !== index))}
              className="ml-2 text-xs hover:text-destructive"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={newPill}
          onChange={(e) => setNewPill(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && addPill()}
          className="flex-1 p-2 border rounded"
          placeholder="Add new pill..."
        />
        <Button onClick={addPill}>Add</Button>
      </div>
    </div>
  );
}

function TextContent({ content }) {
  return <div className="prose max-w-none">{content}</div>;
}

function TableContent({ content }) {
  const [tableData, setTableData] = useState(content);

  const addRow = () => {
    const keys = Object.keys(tableData[0] || { field: "", value: "" });
    const newRow = keys.reduce((acc, key) => ({ ...acc, [key]: "" }), {});
    setTableData([...tableData, newRow]);
  };

  const updateCell = (rowIndex: number, key: string, value: string) => {
    const newContent = [...tableData];
    newContent[rowIndex][key] = value;
    setTableData(newContent);
  };

  return (
    <div className="space-y-4">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {Object.keys(tableData[0]).map((header) => (
              <th key={header} className="border p-2 bg-muted">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {Object.entries(row).map(([key, value]) => (
                <td key={key} className="border p-2">
                  <input
                    type="text"
                    value={value as string}
                    onChange={(e) => updateCell(rowIndex, key, e.target.value)}
                    className="w-full p-1"
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <Button onClick={addRow} variant="outline">
        <Plus className="w-4 h-4 mr-2" />
        Add Row
      </Button>
    </div>
  );
}

const Grid = ({ size, onSizeChange }) => {
  return (
    <div className="fixed inset-0 pointer-events-none">
      <div
        className="w-full h-full"
        style={{
          backgroundSize: `${size}px ${size}px`,
          backgroundImage: "radial-gradient(circle, #ddd 1px, transparent 1px)",
        }}
      />
      <div className="fixed bottom-4 right-4 flex gap-2 pointer-events-auto">
        <Button
          onClick={() => onSizeChange(Math.max(10, size - 10))}
          variant="outline"
          size="sm"
        >
          -
        </Button>
        <span className="px-2 py-1 bg-white rounded border">{size}px</span>
        <Button
          onClick={() => onSizeChange(size + 10)}
          variant="outline"
          size="sm"
        >
          +
        </Button>
      </div>
    </div>
  );
};

interface GridItemProps {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  gridSize: number;
  children: React.ReactNode;
  onResize: (id: string, size: { width: number; height: number }) => void;
}

function GridItem({ id, x, y, w, h, gridSize, children, onResize, onDragEnd }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    position: "absolute",
    left: x,
    top: y,
    width: w,
    height: h,
  };

  return (
    <div ref={setNodeRef} style={style} className="absolute">
      <Resizable
        size={{ width: w, height: h }}
        minWidth={gridSize * 2}
        minHeight={gridSize * 2}
        grid={[gridSize, gridSize]}
        onResizeStop={(e, direction, ref, d) => {
          onResize(id, {
            width: Math.round((w + d.width) / gridSize) * gridSize,
            height: Math.round((h + d.height) / gridSize) * gridSize,
          });
        }}
      >
        <Card className="w-full h-full relative group">
          <div
            {...attributes}
            {...listeners}
            className="absolute left-2 top-2 cursor-move opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <GripVertical className="h-4 w-4" />
          </div>
          <div className="p-4 pt-8">{children}</div>
        </Card>
      </Resizable>
    </div>
  );
}

export function GridSummaryEditor({ initialData }) {
  const [gridSize, setGridSize] = useState(30);
  const [sections, setSections] = useState(
    initialData.map((section) => ({
      ...section,
      x: 0,
      y: 0,
      w: section.width || gridSize * 8,
      h: gridSize * 4,
    }))
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const snapToGrid = (value) => Math.round(value / gridSize) * gridSize;

  const gridSnapModifier: Modifier = ({ transform }) => {
    return {
      ...transform,
      x: snapToGrid(transform.x),
      y: snapToGrid(transform.y),
    };
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    if (!active) return;

    setSections((sections) =>
      sections.map((section) => {
        if (section.id === active.id) {
          return {
            ...section,
            x: snapToGrid(section.x + delta.x),
            y: snapToGrid(section.y + delta.y),
          };
        }
        return section;
      })
    );
  };

  const handleResize = (
    id: string,
    size: { width: number; height: number }
  ) => {
    setSections((sections) =>
      sections.map((section) =>
        section.id === id
          ? { ...section, w: size.width, h: size.height }
          : section
      )
    );
  };

  const renderSectionContent = (section) => {
    switch (section.type) {
      case "text":
        return <div className="prose max-w-none">{section.content}</div>;
      case "table":
        return (
          <table className="w-full border-collapse">
            <tbody>
              {section.content.map((row, index) => (
                <tr key={index}>
                  <td>{row.field}</td>
                  <td>{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case "pill":
        return (
          <div className="flex flex-wrap gap-2">
            {section.content.map((pill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-primary/10 rounded-full text-sm"
              >
                {pill}
              </span>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative w-full h-full min-h-screen">
      <Grid size={gridSize} onSizeChange={setGridSize} />
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[gridSnapModifier]}
      >
        <SortableContext
          items={sections.map((section) => section.id)}
          strategy={verticalListSortingStrategy}
        >
          {sections.map((section) => (
            <GridItem
              key={section.id}
              id={section.id}
              x={section.x}
              y={section.y}
              w={section.w}
              h={section.h}
              gridSize={gridSize}
              onResize={handleResize}
            >
              <h3 className="font-semibold mb-2">{section.title}</h3>
              {renderSectionContent(section)}
            </GridItem>
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}

// Data and Transformation
const data = {
  header: {
    title: "EVALUACIÓN PREANESTÉSICA",
    subtitle1: "PROVINCIA DE CORRIENTES",
    subtitle2: "Servicio de Cirugía miniinvasiva",
  },
  patientInfo: {
    name: "not selected",
    age: "not selected",
    weight: "not selected",
    room: "not selected",
  },
  questions: [
    {
      question:
        "¿Le han dicho que padece o sufre alguna enfermedad del corazón?",
      answer: null,
    },
    {
      question:
        "¿Ha sufrido o sufre de angina de pecho o infarto de miocardio?",
      answer: null,
    },
    {
      question:
        "¿Se despertó alguna vez con sensación de falta de aire o necesitó variar la almohada para dormir?",
      answer: null,
    },
    {
      question:
        "¿Se agita exageradamente al subir escaleras?, ¿Realiza poca actividad física?",
      answer: null,
    },
    {
      question:
        "¿Ha sufrido o sufre de hipertensión arterial? ¿Toma algún medicamento?",
      answer: null,
    },
    {
      question:
        "¿Ha sufrido alguna enfermedad pulmonar prolongada (asma/bronquitis)?",
      answer: null,
    },
    {
      question: "¿Fuma? ¿Desde qué edad? ... N° de cigarrillos ... /día",
      answer: null,
    },
    { question: "¿Tose habitualmente? ¿Con o sin catarro?", answer: null },
    { question: "¿Ha sufrido o está recibiendo corticoides?", answer: null },
    { question: "¿Sabe si tiene diabetes?", answer: null },
    { question: "¿Ha tenido problemas de tiroides?", answer: null },
    {
      question: "¿Ha sufrido o tiene algún familiar con hepatitis?",
      answer: null,
    },
    {
      question: "¿Bebe alcohol? ¿Qué tipo y con qué frecuencia?",
      answer: null,
    },
    { question: "¿Sufre alergias? ¿A qué?", answer: null },
    {
      question: "¿Ha perdido peso? ¿Cuántos Kg. y en cuánto tiempo?",
      answer: null,
    },
    { question: "¿Padece alguna enfermedad renal?", answer: null },
    {
      question: "¿Ha tenido alguna vez convulsiones o epilepsia?",
      answer: null,
    },
    {
      question: "¿Tiene habitualmente dolores de cabeza? ¿Toma aspirina?",
      answer: null,
    },
    {
      question: "¿Sangra con facilidad o se le forman moretones fácilmente?",
      answer: null,
    },
    {
      question:
        "¿Ha sido sometido a cirugías anteriores y qué tipo de anestesia recibió?",
      answer: null,
    },
    {
      question: "¿Utiliza prótesis dentales? ¿tiene dientes flojos?",
      answer: null,
    },
    { question: "Actualmente ¿Toma algún medicamento?", answer: null },
    { question: "Si es mujer ¿Sospecha estar embarazada?", answer: null },
    {
      question:
        "¿Padece o padeció artrosis, debilidad muscular o osteoporosis?",
      answer: null,
    },
    {
      question:
        "¿Le cuesta conciliar el sueño? ¿Toma algún medicamento para dormir?",
      answer: null,
    },
  ],
  physicalExam: {
    mouthOpening: "not selected",
    mallampati: "not selected",
    cervicalMobility: "not selected",
    thyromentalDistance: "not selected",
    jugularVeins: "not selected",
    venousAccess: "not selected",
  },
  labResults: {
    hto: "not selected",
    hb: "not selected",
    platelets: "not selected",
    glucose: "not selected",
    na: "not selected",
    k: "not selected",
    others: "not selected",
  },
  ecg: { rhythm: "Sinusal", cardiovascularRisk: "Bajo" },
  consentText: [
    "Yo, ................................................., o en su defecto yo, ................................................., en carácter de testigo autorizo a que mi médico, luego de evaluar los inconvenientes eventuales y beneficios de la internación, estudios, tratamientos y/o intervención quirúrgica me efectúe.",
    "Asumiendo voluntariamente y conscientemente los riesgos propios del mismo, los cuales me fueron explicados detalladamente.",
    "Declaro haber sido informado de padecer .................................................. diagnóstico al que se arribó por medio de la evaluación clínica y los estudios complementarios. Consiento además en la administración de los anestésicos que sean considerados necesarios o convenientes por el médico responsable comprendiendo que ello puede implicar riesgos - Aclaro que he leído y entendido cada párrafo de esta autorización.",
  ],
};

const transformDataForGrid = (data: any) => [
  {
    id: "header",
    type: "text",
    title: "Evaluación Preanestésica",
    content: `${data.header.title}\n${data.header.subtitle1}\n${data.header.subtitle2}`,
    width: 500,
  },
  {
    id: "patient-info",
    type: "table",
    title: "Información del Paciente",
    content: [
      { field: "Nombre", value: data.patientInfo.name },
      { field: "Edad", value: data.patientInfo.age },
      { field: "Peso", value: data.patientInfo.weight },
      { field: "Habitación", value: data.patientInfo.room },
    ],
    width: 500,
  },
  {
    id: "questionnaire",
    type: "table",
    title: "Cuestionario Médico",
    content: data.questions.map((q) => ({
      field: q.question,
      value:
        q.answer === null ? "No respondido" : q.answer === true ? "Sí" : "No",
    })),
    width: 500,
  },
  {
    id: "physical-exam",
    type: "table",
    title: "Examen Físico",
    content: [
      { field: "Apertura Bucal", value: data.physicalExam.mouthOpening },
      { field: "Mallampati", value: data.physicalExam.mallampati },
      {
        field: "Movilidad Cervical",
        value: data.physicalExam.cervicalMobility,
      },
      {
        field: "Distancia Tiromentoniana",
        value: data.physicalExam.thyromentalDistance,
      },
      { field: "Venas Yugulares", value: data.physicalExam.jugularVeins },
      { field: "Acceso Venoso", value: data.physicalExam.venousAccess },
    ],
    width: 500,
  },
  {
    id: "lab-results",
    type: "table",
    title: "Resultados de Laboratorio",
    content: [
      { field: "HTO", value: data.labResults.hto },
      { field: "HB", value: data.labResults.hb },
      { field: "Plaquetas", value: data.labResults.platelets },
      { field: "Glucosa", value: data.labResults.glucose },
      { field: "Na+", value: data.labResults.na },
      { field: "K+", value: data.labResults.k },
      { field: "Otros", value: data.labResults.others },
    ],
    width: 500,
  },
  {
    id: "ecg",
    type: "pill",
    title: "ECG",
    content: [
      `Ritmo: ${data.ecg.rhythm}`,
      `Riesgo Cardiovascular: ${data.ecg.cardiovascularRisk}`,
    ],
    width: 500,
  },
  {
    id: "consent",
    type: "text",
    title: "Consentimiento Informado",
    content: data.consentText.join("\n\n"),
    width: 500,
  },
];

const gridData = transformDataForGrid(data);

// Default Export Component
export default function SummaryWithData() {
  return <GridSummaryEditor initialData={gridData} />;
}
