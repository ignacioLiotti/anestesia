"use client";

import { useState } from "react";
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
  User,
  FileText,
  Clock,
} from "lucide-react";

// ... (keep the existing interfaces)

export default function SummaryPage() {
  const [formData, setFormData] = useState<CustomFormData>({
    // ... (keep the existing form data)
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
            {formData.header.title}
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300">
            {formData.header.subtitle1}
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {formData.header.subtitle2}
          </p>
        </header>

        <div className="space-y-8">
          <TimelineItem
            icon={<User className="w-6 h-6" />}
            title="Información del Paciente"
            content={<PatientInfo patientInfo={formData.patientInfo} />}
          />
          <TimelineItem
            icon={<FileText className="w-6 h-6" />}
            title="Cuestionario Médico"
            content={<Questionnaire questions={formData.questions} />}
          />
          <TimelineItem
            icon={<Activity className="w-6 h-6" />}
            title="Examen Físico"
            content={<PhysicalExam physicalExam={formData.physicalExam} />}
          />
          <TimelineItem
            icon={<Droplet className="w-6 h-6" />}
            title="Resultados de Laboratorio"
            content={<LabResults labResults={formData.labResults} />}
          />
          <TimelineItem
            icon={<Activity className="w-6 h-6" />}
            title="ECG"
            content={<ECG ecg={formData.ecg} />}
          />
          <TimelineItem
            icon={<Pill className="w-6 h-6" />}
            title="Consentimiento Informado"
            content={<Consent consentText={formData.consentText} />}
          />
        </div>

        <div className="flex justify-between">
          <Button variant="outline">Editar</Button>
          <Button>Imprimir</Button>
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
        </footer>
      </div>
    </div>
  );
}

function TimelineItem({ icon, title, content }) {
  return (
    <div className="flex">
      <div className="flex flex-col items-center mr-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
          {icon}
        </div>
        <div className="w-px h-full bg-blue-300 dark:bg-blue-700"></div>
      </div>
      <div className="pb-8 w-full">
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              {title}
            </h2>
            {content}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function PatientInfo({ patientInfo }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <InfoItem label="Nombre" value={patientInfo.name} />
      <InfoItem label="Edad" value={patientInfo.age} />
      <InfoItem label="Peso" value={`${patientInfo.weight} kg`} />
      <InfoItem label="Habitación" value={patientInfo.room} />
    </div>
  );
}

function Questionnaire({ questions }) {
  return (
    <div className="space-y-4">
      {questions.map((q, index) => (
        <QuestionItem key={index} question={q.question} answer={q.answer} />
      ))}
    </div>
  );
}

function PhysicalExam({ physicalExam }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <InfoItem label="Apertura Bucal" value={physicalExam.mouthOpening} />
      <InfoItem label="Mallampati" value={physicalExam.mallampati.toString()} />
      <InfoItem
        label="Movilidad Cervical"
        value={physicalExam.cervicalMobility}
      />
      <InfoItem
        label="Distancia Tiromentoniana"
        value={physicalExam.thyromentalDistance}
      />
      <InfoItem label="Venas Yugulares" value={physicalExam.jugularVeins} />
      <InfoItem label="Acceso Venoso" value={physicalExam.venousAccess} />
    </div>
  );
}

function LabResults({ labResults }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <InfoItem label="Hematocrito" value={labResults.hto} />
      <InfoItem label="Hemoglobina" value={labResults.hb} />
      <InfoItem label="Plaquetas" value={labResults.platelets} />
      <InfoItem label="Glucosa" value={labResults.glucose} />
      <InfoItem label="Sodio" value={labResults.na} />
      <InfoItem label="Potasio" value={labResults.k} />
      <InfoItem
        label="Otros"
        value={labResults.others}
        className="col-span-full"
      />
    </div>
  );
}

function ECG({ ecg }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <InfoItem label="Ritmo" value={ecg.rhythm} />
      <InfoItem label="Riesgo Cardiovascular" value={ecg.cardiovascularRisk} />
    </div>
  );
}

function Consent({ consentText }) {
  return (
    <div className="space-y-2">
      {consentText.map((text, index) => (
        <p key={index} className="text-sm text-gray-700 dark:text-gray-300">
          {text}
        </p>
      ))}
    </div>
  );
}

function InfoItem({ label, value, className = "" }) {
  return (
    <div className={`${className}`}>
      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
        {label}
      </span>
      <p className="text-gray-900 dark:text-gray-200">{value}</p>
    </div>
  );
}

function QuestionItem({ question, answer }) {
  let icon;
  let color;
  switch (answer) {
    case "yes":
      icon = <CheckCircle2 className="w-5 h-5 text-green-500" />;
      color = "text-green-700 dark:text-green-300";
      break;
    case "no":
      icon = <XCircle className="w-5 h-5 text-red-500" />;
      color = "text-red-700 dark:text-red-300";
      break;
    default:
      icon = <HelpCircle className="w-5 h-5 text-yellow-500" />;
      color = "text-yellow-700 dark:text-yellow-300";
  }

  return (
    <div className="flex items-start space-x-2">
      {icon}
      <div>
        <p className="text-sm text-gray-700 dark:text-gray-300">{question}</p>
        <p className={`text-sm font-medium ${color}`}>
          {answer ? (answer === "yes" ? "Sí" : "No") : "No respondido"}
        </p>
      </div>
    </div>
  );
}
