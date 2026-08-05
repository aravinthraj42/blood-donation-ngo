"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface DashboardChartsProps {
  monthlyRegistrations: { month: string; count: number }[];
  requestsByStatus: { status: string; count: number }[];
  bloodGroupStats: { displayName: string; totalDonors: number }[];
}

const statusColors: Record<string, string> = {
  PENDING: "#f59e0b",
  CONTACTED: "#3b82f6",
  IN_PROGRESS: "#8b5cf6",
  FULFILLED: "#22c55e",
  CANCELLED: "#6b7280",
};

const bloodGroupColors = [
  "#dc2626",
  "#ea580c",
  "#d97706",
  "#ca8a04",
  "#65a30d",
  "#16a34a",
  "#0d9488",
  "#0891b2",
];

export function DashboardCharts({
  monthlyRegistrations,
  requestsByStatus,
  bloodGroupStats,
}: DashboardChartsProps) {
  const statusData = requestsByStatus.map((item) => ({
    name: item.status.replace("_", " "),
    value: item.count,
    fill: statusColors[item.status] || "#6b7280",
  }));

  const bloodGroupData = bloodGroupStats.map((item, index) => ({
    name: item.displayName,
    value: item.totalDonors,
    fill: bloodGroupColors[index % bloodGroupColors.length],
  }));

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Monthly Registrations */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Donor Registrations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRegistrations}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#dc2626" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Requests by Status */}
      <Card>
        <CardHeader>
          <CardTitle>Requests by Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                  labelLine={false}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Donors by Blood Group */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Donors by Blood Group</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bloodGroupData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" allowDecimals={false} />
                <YAxis dataKey="name" type="category" width={50} />
                <Tooltip />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {bloodGroupData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
