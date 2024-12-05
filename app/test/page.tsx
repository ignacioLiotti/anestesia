// app/page.tsx
'use client'
import { Button } from "@/components/ui/button";
import React, { useRef, useState } from "react";
import jsPDF from 'jspdf';
import { Result } from "./components";

export interface CustomFormData {
  data: {
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
    questions: {
      question: string;
      answer: string | null;
    }[];
    physicalExam: {
      mouthOpening: string;
      mallampati: number;
      cervicalMobility: string;
      thyromentalDistance: string;
      jugularVeins: string;
      venousAccess: string;
    };
    labResults: {
      hto: string;
      hb: string;
      platelets: string;
      glucose: string;
      na: string;
      k: string;
      others: string;
    };
    ecg: {
      rhythm: string;
      cardiovascularRisk: string;
    };
    consentText: string[];
  }
}

export default function Home() {
  const sampleFormData: CustomFormData = {
    data: {
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
        { question: "¿Le han dicho que padece o sufre alguna enfermedad del corazón?", answer: "yes" },
        { question: "¿Han sufrido o sufre de angina de pecho o infarto de miocardio?", answer: "no" },
        { question: "¿Se despertó alguna vez con sensación de falta de aire o necesitó variar la almohada para dormir?", answer: null },
        { question: "¿Se agita exageradamente al subir escaleras?, ¿Realiza poca actividad física?", answer: null },
        { question: "¿Ha sufrido o sufre de hipertensión arterial? ¿Toma algún medicamento?", answer: null },
        { question: "¿Ha sufrido alguna enfermedad pulmonar prolongada (asma/bronquitis)?", answer: null },
        { question: "¿Fuma? ¿Desde qué edad? ... N° de cigarrillos ... /día", answer: null },
        { question: "¿Tose habitualmente? ¿Con o sin catarro?", answer: null },
        { question: "¿Ha sufrido o está recibiendo corticoides?", answer: null },
        { question: "¿Sabe si tiene diabetes?", answer: null },
        { question: "¿Ha tenido problemas de tiroides?", answer: null },
        { question: "¿Ha sufrido o tiene algún familiar con hepatitis?", answer: null },
        { question: "¿Bebe alcohol? ¿Qué tipo y con qué frecuencia?", answer: null },
        { question: "¿Sufre alergias? ¿A qué?", answer: null },
        { question: "¿Ha perdido peso? ¿Cuántos Kg. y en cuánto tiempo?", answer: null },
        { question: "¿Padece alguna enfermedad renal?", answer: null },
        { question: "¿Ha tenido alguna vez convulsiones o epilepsia?", answer: null },
        { question: "¿Tiene habitualmente dolores de cabeza? ¿Toma aspirina?", answer: null },
        { question: "¿Sangra con facilidad o se le forman moretones fácilmente?", answer: null },
        { question: "¿Ha sido sometido a cirugías anteriores y qué tipo de anestesia recibió?", answer: null },
        { question: "¿Utiliza prótesis dentales? ¿tiene dientes flojos?", answer: null },
        { question: "Actualmente ¿Toma algún medicamento?", answer: null },
        { question: "Si es mujer ¿Sospecha estar embarazada?", answer: null },
        { question: "¿Padece o padeció artrosis, debilidad muscular o osteoporosis?", answer: null },
        { question: "¿Le cuesta conciliar el sueño? ¿Toma algún medicamento para dormir?", answer: null },
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
    }
  };

  return (<Result formData={sampleFormData} />);
}

