"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
} from "lucide-react";

// ... (keep the existing interfaces)

export default function SummaryPage() {
  const [formData, setFormData] = useState<CustomFormData>({
    // ... (keep the existing form data)
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-blue-900 dark:text-blue-100">
            {formData.header.title}
          </h1>
          <p className="text-xl text-blue-700 dark:text-blue-300">
            {formData.header.subtitle1}
          </p>
          <p className="text-lg text-blue-600 dark:text-blue-400">
            {formData.header.subtitle2}
          </p>
        </header>

        <Tabs defaultValue="patient-info" className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
            <TabsTrigger value="patient-info">Paciente</TabsTrigger>
            <TabsTrigger value="questionnaire">Cuestionario</TabsTrigger>
            <TabsTrigger value="physical-exam">Examen Físico</TabsTrigger>
            <TabsTrigger value="lab-results">Laboratorio</TabsTrigger>
            <TabsTrigger value="ecg">ECG</TabsTrigger>
            <TabsTrigger value="consent">Consentimiento</TabsTrigger>
          </TabsList>
          <TabsContent value="patient-info">
            <PatientInfoCard patientInfo={formData.patientInfo} />
          </TabsContent>
          <TabsContent value="questionnaire">
            <QuestionnaireCard questions={formData.questions} />
          </TabsContent>
          <TabsContent value="physical-exam">
            <PhysicalExamCard physicalExam={formData.physicalExam} />
          </TabsContent>
          <TabsContent value="lab-results">
            <LabResultsCard labResults={formData.labResults} />
          </TabsContent>
          <TabsContent value="ecg">
            <ECGCard ecg={formData.ecg} />
          </TabsContent>
          <TabsContent value="consent">
            <ConsentCard consentText={formData.consentText} />
          </TabsContent>
        </Tabs>

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

function PatientInfoCard({ patientInfo }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="w-6 h-6 mr-2" />
          Información del Paciente
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <InfoItem label="Nombre" value={patientInfo.name} />
          <InfoItem label="Edad" value={patientInfo.age} />
          <InfoItem label="Peso" value={`${patientInfo.weight} kg`} />
          <InfoItem label="Habitación" value={patientInfo.room} />
        </div>
      </CardContent>
    </Card>
  );
}

function QuestionnaireCard({ questions }) {
  const answeredQuestions = questions.filter((q) => q.answer !== null).length;
  const progress = (answeredQuestions / questions.length) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="w-6 h-6 mr-2" />
          Cuestionario Médico
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {answeredQuestions} de {questions.length} preguntas respondidas
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {questions.map((q, index) => (
            <QuestionItem key={index} question={q.question} answer={q.answer} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function PhysicalExamCard({ physicalExam }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Activity className="w-6 h-6 mr-2" />
          Examen Físico
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <InfoItem label="Apertura Bucal" value={physicalExam.mouthOpening} />
          <InfoItem
            label="Mallampati"
            value={physicalExam.mallampati.toString()}
          />
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
      </CardContent>
    </Card>
  );
}

function LabResultsCard({ labResults }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Droplet className="w-6 h-6 mr-2" />
          Resultados de Laboratorio
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <InfoItem label="Hematocrito" value={labResults.hto} />
          <InfoItem label="Hemoglobina" value={labResults.hb} />
          <InfoItem label="Plaquetas" value={labResults.platelets} />
          <InfoItem label="Glucosa" value={labResults.glucose} />
          <InfoItem label="Sodio" value={labResults.na} />
          <InfoItem label="Potasio" value={labResults.k} />
        </div>
        <InfoItem label="Otros" value={labResults.others} className="mt-4" />
      </CardContent>
    </Card>
  );
}

function ECGCard({ ecg }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Activity className="w-6 h-6 mr-2" />
          ECG
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <InfoItem label="Ritmo" value={ecg.rhythm} />
          <InfoItem
            label="Riesgo Cardiovascular"
            value={ecg.cardiovascularRisk}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function ConsentCard({ consentText }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Pill className="w-6 h-6 mr-2" />
          Consentimiento Informado
        </CardTitle>
      </CardHeader>
      <CardContent>
        {consentText.map((text, index) => (
          <p
            key={index}
            className="text-sm text-gray-700 dark:text-gray-300 mb-2"
          >
            {text}
          </p>
        ))}
      </CardContent>
    </Card>
  );
}

function InfoItem({ label, value, className = "" }) {
  return (
    <div className={`flex flex-col ${className}`}>
      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
        {label}
      </span>
      <span className="text-lg text-gray-900 dark:text-gray-200">{value}</span>
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
