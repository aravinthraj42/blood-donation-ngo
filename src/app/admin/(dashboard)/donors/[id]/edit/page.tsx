import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getDonorById } from "@/services/admin";
import { getBloodGroups } from "@/services/public";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { DonorEditForm } from "@/components/admin/donor-edit-form";

export const metadata: Metadata = {
  title: "Edit Donor",
};

export const dynamic = "force-dynamic";

interface EditDonorPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditDonorPage({ params }: EditDonorPageProps) {
  const { id } = await params;

  const [donor, bloodGroups] = await Promise.all([
    getDonorById(id),
    getBloodGroups(),
  ]);

  if (!donor) {
    notFound();
  }

  // Split fullName into first/last for the form
  const nameParts = (donor.fullName ?? "").trim().split(" ");
  const firstName = nameParts[0] ?? "";
  const lastName = nameParts.slice(1).join(" ") || "";

  const currentBloodGroupDisplay =
    bloodGroups.find((bg) => bg.id === donor.bloodGroupId)?.displayName ?? "";

  const defaultValues = {
    firstName,
    lastName,
    age: donor.age ?? 0,
    phone: donor.phone ?? "",
    bloodGroupId: donor.bloodGroupId ?? "",
    lastDonationDate: donor.lastDonationDate ?? "",
    isItEmployee: donor.isItEmployee ?? false,
    companyName: donor.occupation ?? "",
    consentToContact: donor.consentToContact ?? false,
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/admin/donors/${id}`}>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Donor</h1>
          <p className="text-gray-600">{donor.fullName}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Donor Information</CardTitle>
        </CardHeader>
        <CardContent>
          <DonorEditForm
            donorId={id}
            defaultValues={defaultValues}
            bloodGroups={bloodGroups}
            currentBloodGroupDisplay={currentBloodGroupDisplay}
          />
        </CardContent>
      </Card>
    </div>
  );
}
