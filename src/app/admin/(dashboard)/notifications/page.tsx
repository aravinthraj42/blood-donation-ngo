import { Metadata } from "next";
import { format } from "date-fns";
import { getSession } from "@/lib/auth";
import { getNotifications } from "@/services/admin";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NotificationActions } from "@/components/admin/notification-actions";
import { Bell, UserPlus, Droplet, AlertTriangle, CheckCircle } from "lucide-react";
import { PAGINATION } from "@/config/constants";

export const metadata: Metadata = {
  title: "Notifications",
};

interface NotificationsPageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  NEW_DONOR: UserPlus,
  NEW_BLOOD_REQUEST: Droplet,
  URGENT_BLOOD_REQUEST: AlertTriangle,
  DONOR_UPDATED: UserPlus,
  REQUEST_STATUS_CHANGED: CheckCircle,
  CONTENT_PUBLISHED: Bell,
};

const typeColors: Record<string, string> = {
  NEW_DONOR: "bg-blue-100 text-blue-700",
  NEW_BLOOD_REQUEST: "bg-green-100 text-green-700",
  URGENT_BLOOD_REQUEST: "bg-red-100 text-red-700",
  DONOR_UPDATED: "bg-purple-100 text-purple-700",
  REQUEST_STATUS_CHANGED: "bg-orange-100 text-orange-700",
  CONTENT_PUBLISHED: "bg-gray-100 text-gray-700",
};

export default async function NotificationsPage({ searchParams }: NotificationsPageProps) {
  const session = (await getSession())!;
  const params = await searchParams;

  const page = parseInt(params.page || "1", 10);

  const result = await getNotifications(session.admin.id, {
    page,
    pageSize: PAGINATION.DEFAULT_PAGE_SIZE,
  });

  const notifications = "data" in result ? result.data : result;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600">Stay updated with system notifications</p>
        </div>
        <NotificationActions adminId={session.admin.id} />
      </div>

      {notifications.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No notifications yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => {
            const Icon = typeIcons[notification.type] || Bell;

            return (
              <Card
                key={notification.id}
                className={notification.isRead ? "opacity-60" : ""}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-2 rounded-lg ${
                        typeColors[notification.type] || "bg-gray-100"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">
                          {notification.title}
                        </h3>
                        {!notification.isRead && (
                          <Badge variant="destructive" className="text-xs">
                            New
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {format(new Date(notification.createdAt), "dd MMM yyyy, HH:mm")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
