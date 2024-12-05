'use client'

import * as React from "react"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Result from "./test/page"

const steps = [
  {
    title: "Información Personal",
    questions: [
      { id: "name", title: "Nombre", type: "TEXT" },
      { id: "age", title: "Edad", type: "TEXT" },
      { id: "weight", title: "Peso", type: "TEXT" },
      { id: "room", title: "Habitación", type: "TEXT" },
    ],
  },
  {
    title: "Condiciones Médicas",
    questions: [
      { id: "heart", title: "¿Le han dicho que padece o sufre alguna enfermedad del corazón?", type: "LIST" },
      { id: "angina", title: "¿Ha sufrido o sufre de angina de pecho o infarto de miocardio?", type: "LIST" },
      { id: "dyspnea", title: "¿Se despertó alguna vez con sensación de falta de aire o necesitó variar la almohada para dormir?", type: "LIST" },
      { id: "stairs", title: "¿Se agita exageradamente al subir escaleras?, ¿Realiza poca actividad física?", type: "LIST" },
      { id: "hypertension", title: "¿Ha sufrido o sufre de hipertensión arterial? ¿Toma algún medicamento?", type: "LIST" },
      { id: "lungDisease", title: "¿Ha sufrido alguna enfermedad pulmonar prolongada (asma/bronquitis)?", type: "LIST" },
      { id: "smoking", title: "¿Fuma? ¿Desde qué edad? ... N° de cigarrillos ... /día", type: "LIST" },
      { id: "cough", title: "¿Tose habitualmente? ¿Con o sin catarro?", type: "LIST" },
      { id: "corticosteroids", title: "¿Ha sufrido o está recibiendo corticoides?", type: "LIST" },
      { id: "diabetes", title: "¿Sabe si tiene diabetes?", type: "LIST" },
      { id: "thyroid", title: "¿Ha tenido problemas de tiroides?", type: "LIST" },
      { id: "hepatitis", title: "¿Ha sufrido o tiene algún familiar con hepatitis?", type: "LIST" },
      { id: "alcohol", title: "¿Bebe alcohol? ¿Qué tipo y con qué frecuencia?", type: "LIST" },
      { id: "allergies", title: "¿Sufre alergias? ¿A qué?", type: "LIST" },
      { id: "weightLoss", title: "¿Ha perdido peso? ¿Cuántos Kg. y en cuánto tiempo?", type: "LIST" },
      { id: "renalDisease", title: "¿Padece alguna enfermedad renal?", type: "LIST" },
      { id: "seizures", title: "¿Ha tenido alguna vez convulsiones o epilepsia?", type: "LIST" },
      { id: "headaches", title: "¿Tiene habitualmente dolores de cabeza? ¿Toma aspirina?", type: "LIST" },
      { id: "bleeding", title: "¿Sangra con facilidad o se le forman moretones fácilmente?", type: "LIST" },
      { id: "surgeries", title: "¿Ha sido sometido a cirugías anteriores y qué tipo de anestesia recibió?", type: "LIST" },
      { id: "dentalProsthesis", title: "¿Utiliza prótesis dentales? ¿tiene dientes flojos?", type: "LIST" },
      { id: "medications", title: "Actualmente ¿Toma algún medicamento?", type: "LIST" },
      { id: "pregnancy", title: "Si es mujer ¿Sospecha estar embarazada?", type: "LIST" },
      { id: "arthritis", title: "¿Padece o padeció artrosis, debilidad muscular o osteoporosis?", type: "LIST" },
      { id: "sleep", title: "¿Le cuesta conciliar el sueño? ¿Toma algún medicamento para dormir?", type: "LIST" },
      // Add more questions as needed
    ],
  },
  {
    title: "Examen Físico",
    questions: [
      { id: "mouthOpening", title: "Apertura bucal", type: "TEXT" },
      { id: "mallampati", title: "Mallampati", type: "SELECT", options: ["1", "2", "3", "4"] },
      { id: "cervicalMobility", title: "Movilidad cervical", type: "SELECT", options: ["Normal", "Limitada", "Muy limitada"] },
      { id: "thyromentalDistance", title: "Distancia tiromentoniana", type: "TEXT" },
      { id: "jugularVeins", title: "Venas yugulares", type: "SELECT", options: ["Ingurgitadas", "Visibles", "No visibles"] },
      { id: "venousAccess", title: "Accesos venosos", type: "SELECT", options: ["Fácil", "Difícil", "Muy difícil"] },
    ],
  },
  {
    title: "Laboratorio",
    questions: [
      { id: "hto", title: "Hto", type: "TEXT" },
      { id: "hb", title: "Hb", type: "TEXT" },
      { id: "platelets", title: "Plaquetas", type: "TEXT" },
      { id: "glucose", title: "Glucemia", type: "TEXT" },
      { id: "na", title: "Na+", type: "TEXT" },
      { id: "k", title: "K+", type: "TEXT" },
      { id: "others", title: "Otros", type: "PARAGRAPH_TEXT" },
    ],
  },
  // Additional steps like ECG and Consent can be added similarly
]

interface QuestionProps {
  question: {
    id: string
    title: string
    type: string
    options?: string[]
  }
  value: any
  onChange: (value: any) => void
}

const TextQuestion: React.FC<QuestionProps> = ({ question, value, onChange }) => (
  <div className="space-y-2">
    <Label htmlFor={question.id} className="text-gray-700 font-medium text-lg">
      {question.title}
    </Label>
    <Input
      id={question.id}
      placeholder={question.title}
      className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
      value={value === "not selected" ? "" : value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
)

const ListQuestion: React.FC<QuestionProps> = ({ question, value, onChange }) => (
  <div className="space-y-3">
    <Label className="text-gray-700 font-medium text-lg">{question.title}</Label>
    <RadioGroup
      value={value === "not selected" ? "" : value}
      onValueChange={onChange}
      className="grid grid-cols-2 gap-4"
    >
      <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
        onClick={() => onChange("Sí")}
      >
        <RadioGroupItem value="Sí" id={`${question.id}-yes`} />
        <Label htmlFor={`${question.id}-yes`} className="cursor-pointer">Sí</Label>
      </div>
      <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
        onClick={() => onChange("No")}>
        <RadioGroupItem value="No" id={`${question.id}-no`} />
        <Label htmlFor={`${question.id}-no`} className="cursor-pointer">No</Label>
      </div>
    </RadioGroup>
  </div>
)

const MultipleChoiceQuestion: React.FC<QuestionProps> = ({ question, value, onChange }) => (
  <div className="space-y-3">
    <Label className="text-gray-700 font-medium text-lg">{question.title}</Label>
    <div className="grid grid-cols-2 gap-3">
      {question.options?.map((option, index) => {
        const selectedValues = value === "not selected" ? [] : value
        const isChecked = selectedValues.includes(option)
        const handleToggle = () => {
          if (isChecked) {
            onChange(selectedValues.filter((v: string) => v !== option))
          } else {
            onChange([...selectedValues, option])
          }
        }
        return (
          <div
            key={index}
            className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            onClick={handleToggle}
          >
            <Checkbox id={`${question.id}-option${index}`} checked={isChecked} />
            <div
              className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {option}
            </div>
          </div>
        )
      })}
    </div>
  </div>
)

const ParagraphQuestion: React.FC<QuestionProps> = ({ question, value, onChange }) => (
  <div className="space-y-2">
    <Label htmlFor={question.id} className="text-gray-700 font-medium text-lg">
      {question.title}
    </Label>
    <Textarea
      id={question.id}
      placeholder={question.title}
      className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
      value={value === "not selected" ? "" : value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
)

const SelectQuestion: React.FC<QuestionProps> = ({ question, value, onChange }) => (
  <div className="space-y-2">
    <Label htmlFor={question.id} className="text-gray-700 font-medium text-lg">
      {question.title}
    </Label>
    <Select value={value === "not selected" ? "" : value} onValueChange={onChange}>
      <SelectTrigger
        id={question.id}
        className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
      >
        <SelectValue placeholder="Seleccionar opción" />
      </SelectTrigger>
      <SelectContent>
        {question.options?.map((option, index) => (
          <SelectItem key={index} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
)

export default function HomePage() {
  return (
    <MedicalQuestionnaire />
  )
}

function MedicalQuestionnaire() {
  const [step, setStep] = React.useState(0)
  const totalSteps = steps.length
  const [answers, setAnswers] = React.useState<{ [key: string]: any }>(() => {
    // Initialize answers with all questions set to "not selected"
    const initialAnswers: { [key: string]: any } = {}
    steps.forEach(step => {
      step.questions.forEach(question => {
        initialAnswers[question.id] = "not selected"
      })
    })
    return initialAnswers
  })
  const [submittedDataJson, setSubmittedDataJson] = React.useState<string | null>(null)
  const [submittedData, setSubmittedData] = React.useState<string | null>(null)

  const handleNext = () => {
    if (step < totalSteps - 1) setStep(step + 1)
  }

  const handlePrevious = () => {
    if (step > 0) setStep(step - 1)
  }

  const handleSubmit = () => {
    // Map the answers to match the desired structure
    const formattedData = {
      header: {
        title: "EVALUACIÓN PREANESTÉSICA",
        subtitle1: "PROVINCIA DE CORRIENTES",
        subtitle2: "Servicio de Cirugía miniinvasiva",
      },
      patientInfo: {
        name: answers.name,
        age: answers.age,
        weight: answers.weight,
        room: answers.room,
      },
      questions: steps[1].questions.map((q: any) => ({
        question: q.title,
        answer: answers[q.id] === "not selected" ? null : answers[q.id],
      })),
      physicalExam: {
        mouthOpening: answers.mouthOpening,
        mallampati: answers.mallampati,
        cervicalMobility: answers.cervicalMobility,
        thyromentalDistance: answers.thyromentalDistance,
        jugularVeins: answers.jugularVeins,
        venousAccess: answers.venousAccess,
      },
      labResults: {
        hto: answers.hto,
        hb: answers.hb,
        platelets: answers.platelets,
        glucose: answers.glucose,
        na: answers.na,
        k: answers.k,
        others: answers.others,
      },
      ecg: {
        rhythm: "Sinusal", // This can be updated to collect from the form
        cardiovascularRisk: "Bajo", // This can be updated to collect from the form
      },
      consentText: [
        "Yo, ................................................., o en su defecto yo, ................................................., en carácter de testigo autorizo a que mi médico, luego de evaluar los inconvenientes eventuales y beneficios de la internación, estudios, tratamientos y/o intervención quirúrgica me efectúe.",
        "Asumiendo voluntariamente y conscientemente los riesgos propios del mismo, los cuales me fueron explicados detalladamente.",
        "Declaro haber sido informado de padecer .................................................. diagnóstico al que se arribó por medio de la evaluación clínica y los estudios complementarios. Consiento además en la administración de los anestésicos que sean considerados necesarios o convenientes por el médico responsable comprendiendo que ello puede implicar riesgos - Aclaro que he leído y entendido cada párrafo de esta autorización.",
      ],
    }
    console.log('Submitted data:', formattedData)
    setSubmittedDataJson(JSON.stringify(formattedData, null, 2))
    setSubmittedData(formattedData)
  }

  const renderQuestion = (question: any) => {
    const value = answers[question.id]
    const onChange = (newValue: any) => setAnswers((prevAnswers) => ({ ...prevAnswers, [question.id]: newValue }))

    switch (question.type) {
      case "TEXT":
        return <TextQuestion key={question.id} question={question} value={value} onChange={onChange} />
      case "LIST":
        return <ListQuestion key={question.id} question={question} value={value} onChange={onChange} />
      case "MULTIPLE_CHOICE":
        return <MultipleChoiceQuestion key={question.id} question={question} value={value} onChange={onChange} />
      case "PARAGRAPH_TEXT":
        return <ParagraphQuestion key={question.id} question={question} value={value} onChange={onChange} />
      case "SELECT":
        return <SelectQuestion key={question.id} question={question} value={value} onChange={onChange} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
      {!submittedData
        ? (
          <div className="mx-auto max-w-2xl">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">{steps[step].title}</h1>
              <div className="flex gap-2">
                {Array.from({ length: totalSteps }).map((_, index) => (
                  <div
                    key={index}
                    className={`flex-1 h-3 rounded-full transition-all duration-300 ${index <= step ? 'bg-indigo-600' : 'bg-gray-200'
                      }`}
                  />
                ))}
              </div>
            </div>

            <Card className="shadow-lg border-0">
              <CardContent className="p-6 overflow-y-scroll h-[75vh]">
                <div className="grid gap-6">
                  {steps[step].questions.map((question, index) => (
                    <div
                      key={question.id}
                      className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                      {renderQuestion(question)}
                    </div>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="flex justify-between p-6 bg-gray-50">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={step === 0}
                  className="border-2 hover:bg-gray-100"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Anterior
                </Button>
                <Button
                  onClick={step === totalSteps - 1 ? handleSubmit : handleNext}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  {step === totalSteps - 1 ? (
                    "Enviar"
                  ) : (
                    <>
                      Siguiente
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>

        ) : (
          <div className="mx-auto max-w-6xl">
            <div className="mt-8 p-4 bg-white shadow rounded">
              <Result data={submittedData} />
              {/* <pre className="whitespace-pre-wrap">{submittedDataJson}</pre> */}
            </div>
          </div>

        )}
      {/* 
        {submittedData && (
        )} */}
    </div>
  )
}
