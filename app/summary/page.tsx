"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Activity,
  Thermometer,
  Droplet,
  Pill,
  Stethoscope,
  CircleAlert,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import jsPDF from "jspdf";
import html2pdf from "html2pdf.js";

interface Question {
  question: string;
  answer: string | null;
}

interface PhysicalExam {
  mouthOpening: string;
  mallampati: number;
  cervicalMobility: string;
  thyromentalDistance: string;
  jugularVeins: string;
  venousAccess: string;
}

interface LabResults {
  hto: string;
  hb: string;
  platelets: string;
  glucose: string;
  na: string;
  k: string;
  others: string;
}

interface ECG {
  rhythm: string;
  cardiovascularRisk: string;
}

interface CustomFormData {
  header: {
    title: string;
    subtitle1: string;
    subtitle2: string;
  };
  patientInfo: {
    name: string;
    age: string;
    weight: string;
    room: string;
  };
  questions: Question[];
  physicalExam: PhysicalExam;
  labResults: LabResults;
  ecg: ECG;
  consentText: string[];
}

export default function SummaryPage() {
  const [formData, setFormData] = useState<CustomFormData>({
    header: {
      title: "EVALUACIÓN PREANESTÉSICA",
      subtitle1: "PROVINCIA DE CORRIENTES",
      subtitle2: "Servicio de Cirugía miniinvasiva",
    },
    patientInfo: {
      name: "John Doe",
      age: "45",
      weight: "70",
      room: "101",
    },
    questions: [
      {
        question:
          "¿Le han dicho que padece o sufre alguna enfermedad del corazón?",
        answer: "yes",
      },
      {
        question:
          "¿Han sufrido o sufre de angina de pecho o infarto de miocardio?",
        answer: "no",
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
      mouthOpening: "5",
      mallampati: 2,
      cervicalMobility: "Normal",
      thyromentalDistance: "6",
      jugularVeins: "Visible",
      venousAccess: "Good",
    },
    labResults: {
      hto: "40",
      hb: "13",
      platelets: "150,000",
      glucose: "90",
      na: "140",
      k: "4",
      others: "None",
    },
    ecg: {
      rhythm: "Sinus",
      cardiovascularRisk: "Low",
    },
    consentText: [
      "Yo, ................................................., o en su defecto yo, ................................................., en carácter de testigo autorizo a que mi médico, luego de evaluar los inconvenientes eventuales y beneficios de la internación, estudios, tratamientos y/o intervención quirúrgica me efectúe.",
      "Asumiendo voluntariamente y conscientemente los riesgos propios del mismo, los cuales me fueron explicados detalladamente.",
      "Declaro haber sido informado de padecer .................................................. diagnóstico al que se arribó por medio de la evaluación clínica y los estudios complementarios. Consiento además en la administración de los anestésicos que sean considerados necesarios o convenientes por el médico responsable comprendiendo que ello puede implicar riesgos - Aclaro que he leído y entendido cada párrafo de esta autorización.",
    ],
  });

  const getParams = useSearchParams();
  const contentRef = useRef<HTMLDivElement>(null);

  console.log("aca", getParams.get("a"));

  useEffect(() => {
    const params = getParams.get("a");
    if (params) {
      const parsedParams = JSON.parse(params);
      setFormData(parsedParams);
    }
  }, []);

  function printPage() {
    window.print();
  }

  const handleImprimir = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: "a4",
    });

    if (contentRef && contentRef.current) {
      doc.html(contentRef.current, {
        callback: (pdf: any) => {
          pdf.save("clinical_form.pdf");
        },
        x: 10, // Horizontal margin
        y: 10, // Vertical margin
        html2canvas: {
          scale: 0.5, // Adjust the scale to fit content on the page
        },
        width: 190, // A4 width - horizontal margins (210 - 10*2)
      });
    }
  };

  const handleExportPDF = () => {
    //make it the whole document body
    const element = contentRef.current;
    if (element) {
      html2pdf()
        .set({
          margin: 0,
          filename: "clinical_form.pdf",
          image: { type: "jpeg", quality: 0.95 },
          html2canvas: { scale: 4 },
          jsPDF: { unit: "in", format: "a2", orientation: "portrait" },
        })
        .from(element)
        .save();
    }
  };

  return (
    <div
      ref={contentRef}
      className="min-h-screen bg-[hsl(0,0%,98%)] dark:from-gray-900 dark:to-gray-800 p-8"
    >
      <div className="max-w-[1400px] mx-auto space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-black dark:text-blue-100">
            {formData.header.title}
          </h1>
          <div className="flex justify-between">
            <p className="text-xl text-black dark:text-blue-300">
              {formData.header.subtitle1}
            </p>
            <p className="text-lg text-black dark:text-blue-400">
              {formData.header.subtitle2}
            </p>
          </div>
        </header>

        <Section
          icon={<Stethoscope className="w-6 h-6" />}
          title="Información del Paciente"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border rounded-lg p-4">
            <InfoItem
              icon={<Activity className="w-5 h-5" />}
              label="Nombre"
              value={formData.patientInfo.name}
            />
            <InfoItem
              icon={<Activity className="w-5 h-5" />}
              label="Edad"
              value={formData.patientInfo.age}
            />
            <InfoItem
              icon={<Activity className="w-5 h-5" />}
              label="Peso"
              value={`${formData.patientInfo.weight} kg`}
            />
            <InfoItem
              icon={<Activity className="w-5 h-5" />}
              label="Habitación"
              value={formData.patientInfo.room}
            />
          </div>
        </Section>

        <div className="card bg-white shadow-md rounded-lg p-6">
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <Thermometer className="w-6 h-6 mr-2" />
              <h2 className="text-2xl font-bold">Cuestionario Médico</h2>
            </div>
            <div className="relative grid grid-cols-1 sm:grid-cols-2 border rounded-lg">
              {/* Full height vertical separator for 2 columns */}
              <div className="hidden sm:block absolute inset-y-0 left-1/2 w-px bg-gray-300"></div>

              {formData.questions.map((q, index) => (
                <QuestionItem
                  key={index}
                  index={index}
                  question={q.question}
                  answer={q.answer}
                />
              ))}
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center mb-4">
              <Activity className="w-6 h-6 mr-2" />
              <h2 className="text-2xl font-bold">Examen Físico</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border rounded-lg p-4">
              <InfoItem
                icon={<Activity className="w-5 h-5" />}
                label="Apertura Bucal"
                value={formData.physicalExam.mouthOpening}
              />
              <InfoItem
                icon={<Activity className="w-5 h-5" />}
                label="Mallampati"
                value={formData.physicalExam.mallampati.toString()}
              />
              <InfoItem
                icon={<Activity className="w-5 h-5" />}
                label="Movilidad Cervical"
                value={formData.physicalExam.cervicalMobility}
              />
              <InfoItem
                icon={<Activity className="w-5 h-5" />}
                label="Distancia Tiromentoniana"
                value={formData.physicalExam.thyromentalDistance}
              />
              <InfoItem
                icon={<Activity className="w-5 h-5" />}
                label="Venas Yugulares"
                value={formData.physicalExam.jugularVeins}
              />
              <InfoItem
                icon={<Activity className="w-5 h-5" />}
                label="Acceso Venoso"
                value={formData.physicalExam.venousAccess}
              />
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center mb-4">
              <Droplet className="w-6 h-6 mr-2" />
              <h2 className="text-2xl font-bold">Resultados de Laboratorio</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border rounded-lg p-4">
              <InfoItem
                icon={<Droplet className="w-5 h-5" />}
                label="Hematocrito"
                value={formData.labResults.hto}
              />
              <InfoItem
                icon={<Droplet className="w-5 h-5" />}
                label="Hemoglobina"
                value={formData.labResults.hb}
              />
              <InfoItem
                icon={<Droplet className="w-5 h-5" />}
                label="Plaquetas"
                value={formData.labResults.platelets}
              />
              <InfoItem
                icon={<Droplet className="w-5 h-5" />}
                label="Glucosa"
                value={formData.labResults.glucose}
              />
              <InfoItem
                icon={<Droplet className="w-5 h-5" />}
                label="Sodio"
                value={formData.labResults.na}
              />
              <InfoItem
                icon={<Droplet className="w-5 h-5" />}
                label="Potasio"
                value={formData.labResults.k}
              />
              <InfoItem
                icon={<Droplet className="w-5 h-5" />}
                label="Otros"
                value={formData.labResults.others}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center mb-4">
              <Activity className="w-6 h-6 mr-2" />
              <h2 className="text-2xl font-bold">ECG</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InfoItem
                icon={<Activity className="w-5 h-5" />}
                label="Ritmo"
                value={formData.ecg.rhythm}
              />
              <InfoItem
                icon={<Activity className="w-5 h-5" />}
                label="Riesgo Cardiovascular"
                value={formData.ecg.cardiovascularRisk}
              />
            </div>
          </div>
        </div>

        <Section
          icon={<Pill className="w-6 h-6" />}
          title="Consentimiento Informado"
        >
          {formData.consentText.map((text, index) => (
            <p
              key={index}
              className="text-sm text-gray-700 dark:text-gray-300 mb-2"
            >
              {text}
            </p>
          ))}
        </Section>

        <div className="flex justify-between">
          <Button variant="outline">Editar</Button>
          <Button onClick={handleImprimir}>Imprimir</Button>
        </div>

        <footer className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
          <p>
            Este documento es confidencial y destinado únicamente para uso
            médico.
          </p>
          <p>
            Generado el {new Date().toLocaleDateString()} a las{" "}
            {new Date().toLocaleTimeString()}
          </p>
          <button onClick={handleExportPDF}>pelotas</button>
        </footer>
      </div>
    </div>
  );
}

function Section({ icon, title, className, children }) {
  return (
    <Card className={(cn("overflow-hidden"), className)}>
      <CardContent className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          {icon}
          <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-200">
            {title}
          </h2>
        </div>
        <Separator className="mb-4" />
        <div className="space-y-4">{children}</div>
      </CardContent>
    </Card>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-center space-x-2">
      {icon}
      <span className="font-medium text-gray-600 dark:text-gray-400">
        {label}:
      </span>
      <span className="text-gray-900 dark:text-gray-200">{value}</span>
    </div>
  );
}

function QuestionItem({ index, question, answer }) {
  let icon;
  switch (answer) {
    case "yes":
      icon = <CheckCircle2 className="w-5 h-5 text-black green-500" />;
      break;
    case "no":
      icon = <XCircle className="w-5 h-5 text-black red-500" />;
      break;
    default:
      icon = <CircleAlert className="w-5 h-5 text-black yellow-500" />;
  }

  return (
    <div
      className={`flex items-center space-x-2 py-3 px-4 ${
        index % 4 == 0 || index % 4 == 1 ? "bg-gray-100" : ""
      }`}
    >
      {icon}
      <div className="flex justify-between items-center w-full">
        <p className="text-sm text-gray-700 dark:text-gray-300">{question}</p>
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {answer ? (answer === "yes" ? "Sí" : "No") : "No respondido"}
        </p>
      </div>
    </div>
  );
}
