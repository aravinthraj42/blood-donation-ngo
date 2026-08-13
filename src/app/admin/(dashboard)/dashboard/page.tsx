import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  getDashboardStats,
  getBloodGroupStats,
  getMonthlyDonorRegistrations,
  getRequestsByStatus,
  getUnreadNotificationCount,
} from "@/services/admin";
import { getSession } from "@/lib/auth";
import {
  Users,
  UserCheck,
  UserPlus,
  Clock,
  Droplet,
  AlertTriangle,
  CheckCircle,
  Activity,
} from "lucide-react";
import { DashboardCharts } from "@/components/admin/dashboard-charts";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function AdminDashboardPage() {
  const session = (await getSession())!;

  const [stats, bloodGroupStats, monthlyRegistrations, requestsByStatus, unreadCount] =
    await Promise.all([
      getDashboardStats(),
      getBloodGroupStats(),
      getMonthlyDonorRegistrations(6),
      getRequestsByStatus(),
      getUnreadNotificationCount(session.admin.id),
    ]);

  const statCards = [
    {
      title: "Total Donors",
      value: stats.totalDonors,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Active Donors",
      value: stats.activeDonors,
      icon: UserCheck,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Pending Verification",
      value: stats.pendingDonors,
      icon: UserPlus,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Eligible Donors",
      value: stats.eligibleDonors,
      icon: Activity,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Total Requests",
      value: stats.totalRequests,
      icon: Droplet,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Pending Requests",
      value: stats.pendingRequests,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Urgent/Emergency",
      value: stats.urgentRequests,
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Fulfilled Requests",
      value: stats.fulfilledRequests,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back, {session.admin.fullName}
          </p>
        </div>
        {unreadCount > 0 && (
          <Badge variant="destructive" className="text-sm">
            {unreadCount} unread notification{unreadCount > 1 ? "s" : ""}
          </Badge>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Blood Group Availability */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Droplet className="w-5 h-5 text-primary" />
            Blood Group Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 lg:grid-cols-8 gap-4">
            {bloodGroupStats.map((bg) => (
              <div
                key={bg.displayName}
                className="text-center p-3 bg-gray-50 rounded-lg"
              >
                <p className="text-lg font-bold text-gray-900">
                  {bg.displayName}
                </p>
                <p className="text-2xl font-bold text-primary">
                  {bg.totalDonors}
                </p>
                <p className="text-xs text-gray-500">donors</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <DashboardCharts
        monthlyRegistrations={monthlyRegistrations}
        requestsByStatus={requestsByStatus}
        bloodGroupStats={bloodGroupStats}
      />
    </div>
  );
}
