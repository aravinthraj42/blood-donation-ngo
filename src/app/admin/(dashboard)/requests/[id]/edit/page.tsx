import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getBloodRequestById } from "@/services/admin";
import { getBloodGroups } from "@/services/public";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { RequestEditForm } from "@/components/admin/request-edit-form";

export const metadata: Metadata = {
  title: "Edit Blood Request",
};

export const dynamic = "force-dynamic";

interface EditRequestPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditRequestPage({ params }: EditRequestPageProps) {
  const { id } = await params;

  const [request, bloodGroups] = await Promise.all([
    getBloodRequestById(id),
    getBloodGroups(),
  ]);

  if (!request) {
    notFound();
  }

  const nameParts = (request.requesterName ?? "").trim().split(" ");
  const firstName = nameParts[0] ?? "";
  const lastName = nameParts.slice(1).join(" ") || "";

  const currentBloodGroupDisplay =
    bloodGroups.find((bg) => bg.id === request.bloodGroupId)?.displayName ?? "";

  const defaultValues = {
    firstName,
    lastName,
    age: request.requesterAge ?? 0,
    phone: request.contactPhone ?? "",
    bloodGroupId: request.bloodGroupId ?? "",
    isItEmployee: request.requesterIsItEmployee ?? false,
    companyName: request.requesterCompany ?? "",
    reason: request.reason ?? "",
    isUrgent: request.urgency === "URGENT",
    willToDonate: request.requesterWillDonate ?? false,
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/admin/requests/${id}`}>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Blood Request</h1>
          <p className="text-gray-600">{request.requesterName}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Request Information</CardTitle>
        </CardHeader>
        <CardContent>
          <RequestEditForm
            requestId={id}
            defaultValues={defaultValues}
            bloodGroups={bloodGroups}
            currentBloodGroupDisplay={currentBloodGroupDisplay}
          />
        </CardContent>
      </Card>
    </div>
  );
}
