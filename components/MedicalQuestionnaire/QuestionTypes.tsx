import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";

export interface QuestionProps {
  question: {
    id: string;
    title: string;
    type: string;
    options?: string[];
  };
  value: any;
  onChange: (value: any) => void;
}

export const TextQuestion: React.FC<QuestionProps> = ({
  question,
  value,
  onChange,
}) => (
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
);

export const ListQuestion: React.FC<QuestionProps> = ({
  question,
  value,
  onChange,
}) => (
  <div className="space-y-3">
    <Label className="text-gray-700 font-medium text-lg">
      {question.title}
    </Label>
    <RadioGroup
      value={value === "not selected" ? "" : value}
      onValueChange={onChange}
      className="grid grid-cols-2 gap-4"
    >
      <div
        className={`flex items-center justify-center space-x-2 p-2 rounded-lg transition-colors cursor-pointer ${
          value === "Sí" ? "bg-indigo-500 text-white" : "bg-gray-100"
        }`}
        onClick={() => onChange("Sí")}
      >
        <Label
          htmlFor={`${question.id}-yes`}
          className="cursor-pointer text-lg"
        >
          Sí
        </Label>
      </div>
      <div
        className={`flex items-center justify-center space-x-2 p-2 rounded-lg transition-colors cursor-pointer ${
          value === "No" ? "bg-indigo-500 text-white" : "bg-gray-100"
        }`}
        onClick={() => onChange("No")}
      >
        <Label htmlFor={`${question.id}-no`} className="cursor-pointer text-lg">
          No
        </Label>
      </div>
    </RadioGroup>
  </div>
);

export const MultipleChoiceQuestion: React.FC<QuestionProps> = ({
  question,
  value,
  onChange,
}) => (
  <div className="space-y-3">
    <Label className="text-gray-700 font-medium text-lg">
      {question.title}
    </Label>
    <div className="grid grid-cols-2 gap-3">
      {question.options?.map((option, index) => {
        const selectedValues = value === "not selected" ? [] : value;
        const isChecked = selectedValues.includes(option);
        const handleToggle = () => {
          if (isChecked) {
            onChange(selectedValues.filter((v: string) => v !== option));
          } else {
            onChange([...selectedValues, option]);
          }
        };
        return (
          <div
            key={index}
            className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            onClick={handleToggle}
          >
            <Checkbox
              id={`${question.id}-option${index}`}
              checked={isChecked}
            />
            <div className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {option}
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

export const ParagraphQuestion: React.FC<QuestionProps> = ({
  question,
  value,
  onChange,
}) => (
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
);

export const SelectQuestion: React.FC<QuestionProps> = ({
  question,
  value,
  onChange,
}) => (
  <div className="space-y-2">
    <Label htmlFor={question.id} className="text-gray-700 font-medium text-lg">
      {question.title}
    </Label>
    <Select
      value={value === "not selected" ? "" : value}
      onValueChange={onChange}
    >
      <SelectTrigger
        id={question.id}
        className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
      >
        <SelectValue placeholder="Seleccionar opción" />
      </SelectTrigger>
      <SelectContent>
        {question.options?.map((option, index) => (
          <SelectItem key={index} value={option} className="h-12">
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);
