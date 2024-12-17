import { useRef, useState } from "react";
import { CustomFormData } from "./page";
import jsPDF from "jspdf";
import { Button } from "@/components/ui/button";
import html2pdf from "html2pdf.js";

interface ResultProps {
  formData: CustomFormData;
}

export function Result({ formData }: ResultProps) {
  const sampleFormData = {
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
      // {[
      //   "¿Le han dicho que padece o sufre alguna enfermedad del corazón?",
      //   "¿Han sufrido o sufre de angina de pecho o infarto de miocardio?",
      //   "¿Se despertó alguna vez con sensación de falta de aire o necesitó variar la almohada para dormir?",
      //   "¿Se agita exageradamente al subir escaleras?, ¿Realiza poca actividad física?",
      //   "¿Ha sufrido o sufre de hipertensión arterial? ¿Toma algún medicamento?",
      //   "¿Ha sufrido alguna enfermedad pulmonar prolongada (asma/bronquitis)?",
      //   "¿Fuma? ¿Desde qué edad? ... N° de cigarrillos ... /día",
      //   "¿Tose habitualmente? ¿Con o sin catarro?",
      //   "¿Ha sufrido o está recibiendo corticoides?",
      //   "¿Sabe si tiene diabetes?",
      //   "¿Ha tenido problemas de tiroides?",
      //   "¿Ha sufrido o tiene algún familiar con hepatitis?",
      //   "¿Bebe alcohol? ¿Qué tipo y con qué frecuencia?",
      //   "¿Sufre alergias? ¿A qué?",
      //   "¿Ha perdido peso? ¿Cuántos Kg. y en cuánto tiempo?",
      //   "¿Padece alguna enfermedad renal?",
      //   "¿Ha tenido alguna vez convulsiones o epilepsia?",
      //   "¿Tiene habitualmente dolores de cabeza? ¿Toma aspirina?",
      //   "¿Sangra con facilidad o se le forman moretones fácilmente?",
      //   "¿Ha sido sometido a cirugías anteriores y qué tipo de anestesia recibió?",
      //   "¿Utiliza prótesis dentales? ¿tiene dientes flojos?",
      //   "Actualmente ¿Toma algún medicamento?",
      //   "Si es mujer ¿Sospecha estar embarazada?",
      //   "¿Padece o padeció artrosis, debilidad muscular o osteoporosis?",
      //   "¿Le cuesta conciliar el sueño? ¿Toma algún medicamento para dormir?"
      // ]},
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

      // Add more questions as needed
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
  };

  return <ClinicalForm formData={formData ? formData : sampleFormData} />;
}

const ClinicalForm = ({ formData }: { formData: any }) => {
  const [state, setState] = useState(formData);

  const handleInputChange = (section: string, key: string, value: string) => {
    setState((prevState: any) => ({
      ...prevState,
      [section]: {
        ...prevState[section],
        [key]: value,
      },
    }));
  };

  const contentRef = useRef<HTMLDivElement>(null);

  const handleExportPDF = () => {
    const element = contentRef.current;
    if (element) {
      html2pdf()
        .set({
          margin: 10,
          filename: "clinical_form.pdf",
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: "px", format: "a4", orientation: "portrait" },
        })
        .from(element)
        .save();
    }
  };

  return (
    <>
      <div ref={contentRef} className=" mx-auto p-8 bg-white">
        {/* Header Section */}
        <div className="text-center mb-4">
          <div className="font-bold text-xl mb-2">{formData.header.title}</div>
          <div className="text-sm mb-2">{formData.header.subtitle1}</div>
          <div className="text-sm mb-4">{formData.header.subtitle2}</div>
        </div>

        {/* Patient Info Section */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4 items-center">
            <span className="font-bold">PACIENTE:</span>
            <input
              type="text"
              className="border-b border-gray-300 w-48"
              defaultValue={formData.patientInfo.name}
            />
            <span className="font-bold">EDAD:</span>
            <input
              type="text"
              className="border-b border-gray-300 w-16"
              defaultValue={formData.patientInfo.age}
            />
            <span>años</span>
            <span className="font-bold">PESO:</span>
            <input
              type="text"
              className="border-b border-gray-300 w-16"
              defaultValue={formData.patientInfo.weight}
            />
            <span>Kg.</span>
          </div>
          <div className="flex gap-2">
            <span className="font-bold">SALA:</span>
            <input
              type="text"
              className="border-b border-gray-300 w-16"
              defaultValue={formData.patientInfo.room}
            />
          </div>
        </div>

        {/* Interrogatorio Section */}
        <div className="mb-6">
          <div className="font-bold text-center mb-4">INTERROGATORIO</div>
          <div className="space-y-2">
            {formData.questions.map((item: any, index: number) => {
              return (
                <div key={index} className="flex items-start gap-4">
                  <span className="w-6">{index + 1})</span>
                  <span className="flex-1">{item.question}</span>
                  <div className="flex gap-4">
                    <label>
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value="Sí"
                        checked={item.answer === "Sí"}
                      />{" "}
                      SI
                    </label>
                    <label>
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value="No"
                        checked={item.answer === "No"}
                      />{" "}
                      NO
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Physical Exam Section */}
        <div className="mb-6">
          <div className="font-bold">EXAMEN FÍSICO:</div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div>
                Apertura bucal:{" "}
                <input
                  type="text"
                  className="border-b border-gray-300 w-16"
                  defaultValue={formData.physicalExam.mouthOpening}
                />{" "}
                cm
              </div>
              <div>
                Mallampati: <span>{formData.physicalExam.mallampati}</span>
              </div>
              <div>
                Movilidad cervical:{" "}
                <input
                  type="text"
                  className="border-b border-gray-300 w-16"
                  defaultValue={formData.physicalExam.cervicalMobility}
                />
              </div>
            </div>
            <div>
              <div>
                Distancia tiromentoniana:{" "}
                <input
                  type="text"
                  className="border-b border-gray-300 w-16"
                  defaultValue={formData.physicalExam.thyromentalDistance}
                />{" "}
                cm
              </div>
              <div>
                Venas yugulares:{" "}
                <input
                  type="text"
                  className="border-b border-gray-300 w-16"
                  defaultValue={formData.physicalExam.jugularVeins}
                />
              </div>
              <div>
                Accesos venosos:{" "}
                <input
                  type="text"
                  className="border-b border-gray-300 w-16"
                  defaultValue={formData.physicalExam.venousAccess}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Laboratory Section */}
        <div className="mb-6">
          <div className="font-bold">LABORATORIO:</div>
          <div className="grid grid-cols-4 gap-4">
            {Object.entries(formData.labResults).map(([key, value]) => (
              <div key={key}>
                <div>
                  {key.toUpperCase()}:{" "}
                  <input
                    type="text"
                    className="border-b border-gray-300 w-16"
                    defaultValue={value as string}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ECG Section */}
        <div className="mb-6">
          <div className="font-bold">ECG:</div>
          <div>
            Ritmo:{" "}
            <input
              type="text"
              className="border-b border-gray-300 w-64"
              defaultValue={formData.ecg.rhythm}
            />
            Riesgo quirúrgico cardiovascular:{" "}
            <input
              type="text"
              className="border-b border-gray-300 w-16"
              defaultValue={formData.ecg.cardiovascularRisk}
            />
          </div>
        </div>

        {/* Consent Text */}
        <div className="text-sm mt-8">
          {formData.consentText.map((paragraph: string, index: number) => (
            <p key={index} className="mb-4">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
      <Button onClick={handleExportPDF}>Exportar a PDF</Button>
    </>
  );
};
