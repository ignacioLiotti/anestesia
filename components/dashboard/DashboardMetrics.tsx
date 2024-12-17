import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Activity, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { useFormList } from "@/hooks/useFormLists";

function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
}: {
  title: string;
  value: string | number;
  description?: string;
  icon: typeof Activity;
  trend?: { value: number; isPositive: boolean };
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
        {trend && (
          <div
            className={`text-xs mt-1 ${
              trend.isPositive ? "text-green-500" : "text-red-500"
            }`}
          >
            {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}% from last
            month
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function StatusDistribution({
  statuses,
}: {
  statuses: { name: string; value: number }[];
}) {
  return (
    <div className="flex gap-2">
      {statuses.map((status) => (
        <div
          key={status.name}
          className="flex-1 text-center p-2 bg-card rounded-lg border"
        >
          <div className="text-2xl font-bold">{status.value}</div>
          <div className="text-xs text-muted-foreground">{status.name}</div>
        </div>
      ))}
    </div>
  );
}

function FormActivityChart({
  data,
}: {
  data: { date: string; count: number }[];
}) {
  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 10, left: 10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            tickMargin={10}
            className="text-xs"
          />
          <YAxis tickLine={false} tickMargin={10} className="text-xs" />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="count"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function DashboardMetrics() {
  const { forms } = useFormList();

  // Calculate basic metrics
  const totalForms = forms.length;
  const publishedForms = forms.filter((f) => f.isPublished).length;
  const draftForms = totalForms - publishedForms;
  const completedForms = 0; // This will be replaced with actual submissions data

  // Calculate status distribution
  const statuses = [
    { name: "Published", value: publishedForms },
    { name: "Drafts", value: draftForms },
    { name: "Completed", value: completedForms },
  ];

  // Generate mock activity data for the last 7 days
  const activityData = Array.from({ length: 7 })
    .map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return {
        date: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        count: Math.floor(Math.random() * 10),
      };
    })
    .reverse();

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Forms"
          value={totalForms}
          description="Total forms created"
          icon={FileText}
          trend={{ value: 12, isPositive: true }}
        />
        <MetricCard
          title="Published Forms"
          value={publishedForms}
          description="Forms available to users"
          icon={CheckCircle}
          trend={{ value: 8, isPositive: true }}
        />
        <MetricCard
          title="Draft Forms"
          value={draftForms}
          description="Forms in progress"
          icon={AlertCircle}
          trend={{ value: 4, isPositive: false }}
        />
        <MetricCard
          title="Submissions"
          value={completedForms}
          description="Total form submissions"
          icon={Activity}
          trend={{ value: 0, isPositive: true }}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Form Activity</CardTitle>
            <CardDescription>Form submissions over time</CardDescription>
          </CardHeader>
          <CardContent>
            <FormActivityChart data={activityData} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Form Status Distribution</CardTitle>
          <CardDescription>Overview of form statuses</CardDescription>
        </CardHeader>
        <CardContent>
          <StatusDistribution statuses={statuses} />
        </CardContent>
      </Card>
    </div>
  );
}
