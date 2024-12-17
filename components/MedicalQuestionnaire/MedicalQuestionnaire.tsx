import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";
import { CustomFormData } from "@/app/test/page";
import {
  ListQuestion,
  MultipleChoiceQuestion,
  ParagraphQuestion,
  SelectQuestion,
  TextQuestion,
} from "./QuestionTypes";

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
      {
        id: "heart",
        title:
          "¿Le han dicho que padece o sufre alguna enfermedad del corazón?",
        type: "LIST",
      },
      {
        id: "angina",
        title: "¿Ha sufrido o sufre de angina de pecho o infarto de miocardio?",
        type: "LIST",
      },
      {
        id: "dyspnea",
        title:
          "¿Se despertó alguna vez con sensación de falta de aire o necesitó variar la almohada para dormir?",
        type: "LIST",
      },
      {
        id: "stairs",
        title:
          "¿Se agita exageradamente al subir escaleras?, ¿Realiza poca actividad física?",
        type: "LIST",
      },
      {
        id: "hypertension",
        title:
          "¿Ha sufrido o sufre de hipertensión arterial? ¿Toma algún medicamento?",
        type: "LIST",
      },
      {
        id: "lungDisease",
        title:
          "¿Ha sufrido alguna enfermedad pulmonar prolongada (asma/bronquitis)?",
        type: "LIST",
      },
      {
        id: "smoking",
        title: "¿Fuma? ¿Desde qué edad? ... N° de cigarrillos ... /día",
        type: "LIST",
      },
      {
        id: "cough",
        title: "¿Tose habitualmente? ¿Con o sin catarro?",
        type: "LIST",
      },
      {
        id: "corticosteroids",
        title: "¿Ha sufrido o está recibiendo corticoides?",
        type: "LIST",
      },
      { id: "diabetes", title: "¿Sabe si tiene diabetes?", type: "LIST" },
      {
        id: "thyroid",
        title: "¿Ha tenido problemas de tiroides?",
        type: "LIST",
      },
      {
        id: "hepatitis",
        title: "¿Ha sufrido o tiene algún familiar con hepatitis?",
        type: "LIST",
      },
      {
        id: "alcohol",
        title: "¿Bebe alcohol? ¿Qué tipo y con qué frecuencia?",
        type: "LIST",
      },
      { id: "allergies", title: "¿Sufre alergias? ¿A qué?", type: "LIST" },
      {
        id: "weightLoss",
        title: "¿Ha perdido peso? ¿Cuántos Kg. y en cuánto tiempo?",
        type: "LIST",
      },
      {
        id: "renalDisease",
        title: "¿Padece alguna enfermedad renal?",
        type: "LIST",
      },
      {
        id: "seizures",
        title: "¿Ha tenido alguna vez convulsiones o epilepsia?",
        type: "LIST",
      },
      {
        id: "headaches",
        title: "¿Tiene habitualmente dolores de cabeza? ¿Toma aspirina?",
        type: "LIST",
      },
      {
        id: "bleeding",
        title: "¿Sangra con facilidad o se le forman moretones fácilmente?",
        type: "LIST",
      },
      {
        id: "surgeries",
        title:
          "¿Ha sido sometido a cirugías anteriores y qué tipo de anestesia recibió?",
        type: "LIST",
      },
      {
        id: "dentalProsthesis",
        title: "¿Utiliza prótesis dentales? ¿tiene dientes flojos?",
        type: "LIST",
      },
      {
        id: "medications",
        title: "Actualmente ¿Toma algún medicamento?",
        type: "LIST",
      },
      {
        id: "pregnancy",
        title: "Si es mujer ¿Sospecha estar embarazada?",
        type: "LIST",
      },
      {
        id: "arthritis",
        title: "¿Padece o padeció artrosis, debilidad muscular o osteoporosis?",
        type: "LIST",
      },
      {
        id: "sleep",
        title:
          "¿Le cuesta conciliar el sueño? ¿Toma algún medicamento para dormir?",
        type: "LIST",
      },
      // Add more questions as needed
    ],
  },
  {
    title: "Examen Físico",
    questions: [
      { id: "mouthOpening", title: "Apertura bucal", type: "TEXT" },
      {
        id: "mallampati",
        title: "Mallampati",
        type: "SELECT",
        options: ["1", "2", "3", "4"],
      },
      {
        id: "cervicalMobility",
        title: "Movilidad cervical",
        type: "SELECT",
        options: ["Normal", "Limitada", "Muy limitada"],
      },
      {
        id: "thyromentalDistance",
        title: "Distancia tiromentoniana",
        type: "TEXT",
      },
      {
        id: "jugularVeins",
        title: "Venas yugulares",
        type: "SELECT",
        options: ["Ingurgitadas", "Visibles", "No visibles"],
      },
      {
        id: "venousAccess",
        title: "Accesos venosos",
        type: "SELECT",
        options: ["Fácil", "Difícil", "Muy difícil"],
      },
      // add a multiple choice type question
      {
        id: "multipleChoiceQuestion",
        title: "Pregunta de opción múltiple",
        type: "MULTIPLE_CHOICE",
        options: ["Opción 1", "Opción 2", "Opción 3", "Opción 4"],
      },
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
];

export function MedicalQuestionnaire({ propSteps }) {
  console.log(propSteps);
  const [step, setStep] = React.useState(0);

  const questionaireSteps = propSteps ? propSteps : steps;

  const totalSteps = questionaireSteps.length;
  const router = useRouter();

  const [answers, setAnswers] = React.useState<{ [key: string]: any }>(() => {
    // Initialize answers with all questions set to "not selected"
    const initialAnswers: { [key: string]: any } = {};
    questionaireSteps.forEach((step) => {
      step.questions.forEach((question) => {
        initialAnswers[question.id] = "not selected";
      });
    });
    return initialAnswers;
  });
  const [submittedDataJson, setSubmittedDataJson] = React.useState<
    string | null
  >(null);
  const [submittedData, setSubmittedData] =
    React.useState<CustomFormData | null>(null);

  const handleNext = () => {
    if (step < totalSteps - 1) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleSubmit = () => {
    // Map the answers to match the desired structure
    const formattedData: CustomFormData = {
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
      questions: questionaireSteps[1].questions.map((q: any) => ({
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
    };
    console.log("Submitted data:", formattedData);
    setSubmittedDataJson(JSON.stringify(formattedData, null, 2));
    setSubmittedData(formattedData);

    //redirect to /summary with all the data on params

    //use the router sintax of next/navigation

    router.push(
      "/summary" + "?a=" + `${JSON.stringify(formattedData, null, 2)}`
    );
  };

  const renderQuestion = (question: any) => {
    const value = answers[question.id];
    const onChange = (newValue: any) =>
      setAnswers((prevAnswers) => ({
        ...prevAnswers,
        [question.id]: newValue,
      }));

    switch (question.type) {
      case "TEXT":
        return (
          <TextQuestion
            key={question.id}
            question={question}
            value={value}
            onChange={onChange}
          />
        );
      case "LIST":
        return (
          <ListQuestion
            key={question.id}
            question={question}
            value={value}
            onChange={onChange}
          />
        );
      case "MULTIPLE_CHOICE":
        return (
          <MultipleChoiceQuestion
            key={question.id}
            question={question}
            value={value}
            onChange={onChange}
          />
        );
      case "PARAGRAPH_TEXT":
        return (
          <ParagraphQuestion
            key={question.id}
            question={question}
            value={value}
            onChange={onChange}
          />
        );
      case "SELECT":
        return (
          <SelectQuestion
            key={question.id}
            question={question}
            value={value}
            onChange={onChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
      {!submittedData ? (
        <div className="mx-auto max-w-2xl">
          <Card className="shadow-lg border-0">
            <CardContent className="p-6 overflow-y-scroll h-[75vh]">
              <div className="flex flex-col justify-center items-start ">
                <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
                  {questionaireSteps[step].title}
                </h1>
                <div className="">
                  <div className="text-1xl font-bold text-gray-900 text-center mb-2">
                    <span className="inline-block bg-indigo-600 text-white px-3 py-1 rounded-full">
                      Paso {step + 1} de {totalSteps}
                    </span>
                  </div>
                </div>
              </div>
              <div className="grid gap-6">
                {questionaireSteps[step].questions.map((question, index) => (
                  <div
                    key={question.id}
                    className=" bg-white rounded-lg transition-shadow duration-200"
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
        <></>
        // <div className="mx-auto max-w-6xl">
        //   <div className="mt-8 p-4 bg-white shadow rounded">
        //     <Result formData={submittedData} />
        //     {/* <pre className="whitespace-pre-wrap">{submittedDataJson}</pre> */}
        //   </div>
        // </div>
      )}
      {/* 
          {submittedData && (
          )} */}
    </div>
  );
}
