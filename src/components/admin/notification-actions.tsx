"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCheck } from "lucide-react";
import { markAllNotificationsRead } from "@/actions/admin-notification";
import { toast } from "sonner";

interface NotificationActionsProps {
  adminId: string;
}

export function NotificationActions({ adminId }: NotificationActionsProps) {
  const router = useRouter();

  const handleMarkAllRead = async () => {
    const result = await markAllNotificationsRead(adminId);
    if (result.success) {
      toast.success("All notifications marked as read");
      router.refresh();
    } else {
      toast.error("Failed to mark notifications as read");
    }
  };

  return (
    <Button variant="outline" onClick={handleMarkAllRead}>
      <CheckCheck className="w-4 h-4 mr-2" />
      Mark All as Read
    </Button>
  );
}
