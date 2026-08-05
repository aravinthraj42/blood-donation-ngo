import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { requireAdmin } from "@/lib/auth";
import { getBloodRequestById } from "@/services/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Phone, MapPin, Calendar, AlertTriangle, User, Droplet } from "lucide-react";
import { RequestNotesForm } from "@/components/admin/request-notes-form";

export const metadata: Metadata = {
  title: "Request Details",
};

interface RequestDetailPageProps {
  params: Promise<{ id: string }>;
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONTACTED: "bg-blue-100 text-blue-700",
  IN_PROGRESS: "bg-purple-100 text-purple-700",
  FULFILLED: "bg-green-100 text-green-700",
  CANCELLED: "bg-gray-100 text-gray-700",
};

const urgencyColors: Record<string, string> = {
  NORMAL: "bg-gray-100 text-gray-700",
  URGENT: "bg-orange-100 text-orange-700",
  EMERGENCY: "bg-red-100 text-red-700",
};

export default async function RequestDetailPage({ params }: RequestDetailPageProps) {
  await requireAdmin();
  const { id } = await params;

  const request = await getBloodRequestById(id);

  if (!request) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/requests">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">
                {request.referenceNumber}
              </h1>
              {request.urgency === "EMERGENCY" && (
                <Badge className="bg-red-100 text-red-700">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  EMERGENCY
                </Badge>
              )}
            </div>
            <p className="text-gray-600">Blood Request Details</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={urgencyColors[request.urgency]}>
            {request.urgency}
          </Badge>
          <Badge className={statusColors[request.status]}>
            {request.status.replace("_", " ")}
          </Badge>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Request Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Patient Name</p>
                <p className="font-medium text-lg">{request.patientName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Blood Group Required</p>
                <Badge variant="outline" className="font-semibold text-lg">
                  <Droplet className="w-4 h-4 mr-1 text-primary" />
                  {request.bloodGroup?.displayName || "-"}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Units Required</p>
                <p className="font-medium">{request.unitsRequired} units</p>
              </div>
              {request.reason && (
                <div>
                  <p className="text-sm text-gray-500">Reason</p>
                  <p className="font-medium">{request.reason}</p>
                </div>
              )}
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium">{request.hospitalName}</p>
                  <p className="text-gray-500">{request.hospitalLocation}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>
                  Required: {format(new Date(request.requiredDate), "dd MMMM yyyy")}
                  {request.requiredTime && ` at ${request.requiredTime}`}
                </span>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-3">Contact Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Requester</p>
                    <p className="font-medium">{request.requesterName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Contact</p>
                    <a
                      href={`tel:${request.contactPhone}`}
                      className="font-medium text-primary"
                    >
                      {request.contactPhone}
                    </a>
                  </div>
                </div>
                {request.alternativeContact && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Alternative</p>
                      <a
                        href={`tel:${request.alternativeContact}`}
                        className="font-medium"
                      >
                        {request.alternativeContact}
                      </a>
                    </div>
                  </div>
                )}
                {request.pocName && (
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Hospital POC</p>
                      <p className="font-medium">
                        {request.pocName}
                        {request.pocPhone && ` - ${request.pocPhone}`}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Record Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Created</span>
                <span>{format(new Date(request.createdAt), "dd MMM yyyy, HH:mm")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Updated</span>
                <span>{format(new Date(request.updatedAt), "dd MMM yyyy, HH:mm")}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Internal Notes</CardTitle>
            </CardHeader>
            <CardContent>
              {request.internalNotes ? (
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans bg-gray-50 p-3 rounded-lg">
                  {request.internalNotes}
                </pre>
              ) : (
                <p className="text-sm text-gray-500">No notes yet.</p>
              )}
              <Separator className="my-4" />
              <RequestNotesForm requestId={request.id} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
