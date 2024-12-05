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

const steps = [
  {
    title: "Información Personal",
    questions: [
      { id: "name", title: "Nombre", type: "TEXT" },
      { id: "insurance", title: "Obra Social", type: "TEXT" },
      { id: "age", title: "Edad", type: "TEXT" },
      { id: "weight", title: "Peso", type: "TEXT" },
      { id: "height", title: "Altura", type: "TEXT" },
    ],
  },
  {
    title: "Condiciones Médicas",
    questions: [
      { id: "heart", title: "¿Padece alguna enfermedad del corazón?", type: "LIST" },
      { id: "angina", title: "¿Ha sufrido angina de pecho o infarto?", type: "LIST" },
      { id: "dyspnea", title: "¿Se despierta con falta de aire?", type: "LIST" },
      { id: "stairs", title: "¿Se agita al subir escaleras?", type: "LIST" },
      { id: "hypertension", title: "¿Sufre de hipertensión arterial?", type: "LIST" },
      { id: "pulmonary", title: "¿Ha sufrido enfermedades pulmonares?", type: "LIST" },
      { id: "smoke", title: "¿Fuma?", type: "LIST" },
      { id: "cough", title: "¿Tose habitualmente?", type: "LIST" },
      { id: "steroids", title: "¿Usa corticoides?", type: "LIST" },
      { id: "diabetes", title: "¿Tiene diabetes?", type: "LIST" },
      { id: "thyroid", title: "¿Tiene problemas de tiroides?", type: "LIST" },
      { id: "hepatitis", title: "¿Ha sufrido hepatitis?", type: "LIST" },
      { id: "alcohol", title: "¿Bebe alcohol?", type: "LIST" },
      { id: "allergies", title: "¿Sufre alergias?", type: "MULTIPLE_CHOICE", options: ["Medicamentos", "Alimentos", "Otros"] },
    ],
  },
  {
    title: "Examen Físico",
    questions: [
      { id: "mouth-opening", title: "Apertura bucal", type: "TEXT" },
      { id: "thyromental-distance", title: "Distancia tiromentoniana", type: "TEXT" },
      { id: "mallampati", title: "Mallampati", type: "SELECT", options: ["Clase I", "Clase II", "Clase III", "Clase IV"] },
      { id: "neck-mobility", title: "Movilidad cervical", type: "SELECT", options: ["Normal", "Limitada", "Muy limitada"] },
      { id: "jugular-veins", title: "Venas yugulares", type: "MULTIPLE_CHOICE", options: ["Ingurgitadas", "Visibles"] },
      { id: "venous-access", title: "Accesos venosos", type: "SELECT", options: ["Fácil", "Difícil", "Muy difícil"] },
      { id: "observations", title: "Observaciones", type: "PARAGRAPH_TEXT" },
    ],
  },
  {
    title: "Laboratorio",
    questions: [
      { id: "hto", title: "Hto", type: "TEXT" },
      { id: "hb", title: "Hb", type: "TEXT" },
      { id: "glucose", title: "Glucemia", type: "TEXT" },
      { id: "platelets", title: "Plaquetas", type: "TEXT" },
      { id: "uremia", title: "Uremia", type: "TEXT" },
      { id: "na", title: "Na+", type: "TEXT" },
      { id: "k", title: "K+", type: "TEXT" },
      { id: "cl", title: "Cl-", type: "TEXT" },
      { id: "kptt", title: "KPTT", type: "TEXT" },
      { id: "rin", title: "RIN", type: "TEXT" },
      { id: "ap", title: "AP", type: "TEXT" },
    ],
  },
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
  const [submittedData, setSubmittedData] = React.useState<string | null>(null)

  const handleNext = () => {
    if (step < totalSteps - 1) setStep(step + 1)
  }

  const handlePrevious = () => {
    if (step > 0) setStep(step - 1)
  }

  const handleSubmit = () => {
    // Include all questions, even if not answered (already initialized)
    const formattedData = JSON.stringify(answers, null, 2)
    console.log('Submitted data:', formattedData)
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

        {submittedData && (
          <div className="mt-8 p-4 bg-white shadow rounded">
            <h2 className="text-2xl font-bold mb-4">Submitted Data</h2>
            <pre className="whitespace-pre-wrap">{submittedData}</pre>
          </div>
        )}
      </div>
    </div>
  )
}
