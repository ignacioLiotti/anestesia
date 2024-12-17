// src/components/summary/items/SummaryItems.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SummaryItemProps {
  title: string;
  value: any;
  type?: "text" | "metric" | "chart";
  style?: any;
  className?: string;
}

// Different display components for different types of data
export function TextItem({ title, value, style, className }: SummaryItemProps) {
  return (
    <div className={cn("space-y-1", className)} style={style}>
      <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>
      <p className="text-lg font-medium">{value}</p>
    </div>
  );
}

export function MetricItem({
  title,
  value,
  style,
  className,
}: SummaryItemProps) {
  return (
    <Card className={cn("", className)} style={style}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

// Style presets that can be applied to any item
export const STYLE_PRESETS = {
  default: {
    name: "Default",
    styles: {
      text: {
        className: "bg-white p-4 rounded-lg shadow-sm",
      },
      metric: {
        className: "bg-white",
      },
    },
  },
  minimal: {
    name: "Minimal",
    styles: {
      text: {
        className: "p-2",
      },
      metric: {
        className: "border-none shadow-none",
      },
    },
  },
  bordered: {
    name: "Bordered",
    styles: {
      text: {
        className: "border-2 border-gray-200 p-4 rounded-lg",
      },
      metric: {
        className: "border-2 border-gray-200",
      },
    },
  },
  colorful: {
    name: "Colorful",
    styles: {
      text: {
        className: "bg-blue-50 p-4 rounded-lg text-blue-900",
      },
      metric: {
        className: "bg-blue-50 text-blue-900",
      },
    },
  },
};

// Helper function to get dummy data for preview
export function getDummyValue(type: string): any {
  const dummyData = {
    name: ["John Doe", "Jane Smith", "Robert Johnson"],
    age: [25, 35, 45, 55],
    weight: [70, 75, 80, 85],
    bloodPressure: ["120/80", "130/85", "125/82"],
    temperature: [36.5, 36.8, 37.0],
    pulse: [72, 75, 80],
    text: ["Normal", "Stable", "Good"],
  };

  const category = type.toLowerCase();
  const dataArray =
    dummyData[category as keyof typeof dummyData] || dummyData.text;
  return dataArray[Math.floor(Math.random() * dataArray.length)];
}
