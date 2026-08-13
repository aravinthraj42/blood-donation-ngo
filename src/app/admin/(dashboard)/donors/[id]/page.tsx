import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { getDonorById } from "@/services/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Edit, Phone, Mail, MapPin, Calendar, Droplet } from "lucide-react";

export const metadata: Metadata = {
  title: "Donor Details",
};

interface DonorDetailPageProps {
  params: Promise<{ id: string }>;
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  ACTIVE: "bg-green-100 text-green-700",
  INACTIVE: "bg-gray-100 text-gray-700",
  DEACTIVATED: "bg-red-100 text-red-700",
};

const verificationColors: Record<string, string> = {
  VERIFIED: "bg-blue-100 text-blue-700",
  UNVERIFIED: "bg-orange-100 text-orange-700",
};

export default async function DonorDetailPage({ params }: DonorDetailPageProps) {
  const { id } = await params;

  const donor = await getDonorById(id);

  if (!donor) {
    notFound();
  }

  const isEligible =
    donor.nextEligibleDate && new Date(donor.nextEligibleDate) <= new Date();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/donors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{donor.fullName}</h1>
            <p className="text-gray-600">Donor Details</p>
          </div>
        </div>
        <Button asChild>
          <Link href={`/admin/donors/${id}?edit=true`}>
            <Edit className="w-4 h-4 mr-2" />
            Edit Donor
          </Link>
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium">{donor.fullName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Blood Group</p>
                <Badge variant="outline" className="font-semibold text-lg">
                  <Droplet className="w-4 h-4 mr-1 text-primary" />
                  {donor.bloodGroup?.displayName || "-"}
                </Badge>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-400" />
                <span>{donor.phone}</span>
              </div>
              {donor.email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>{donor.email}</span>
                </div>
              )}
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <p>{donor.address}</p>
                  <p className="text-gray-500">
                    {donor.city}, {donor.district}, {donor.state} - {donor.pincode}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              {donor.dateOfBirth && (
                <div>
                  <p className="text-sm text-gray-500">Date of Birth</p>
                  <p className="font-medium flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {format(new Date(donor.dateOfBirth), "dd MMMM yyyy")}
                  </p>
                </div>
              )}
              {donor.occupation && (
                <div>
                  <p className="text-sm text-gray-500">Occupation</p>
                  <p className="font-medium">{donor.occupation}</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Preferred Contact</p>
                <p className="font-medium">{donor.preferredContactMethod}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Consent to Contact</p>
                <p className="font-medium">
                  {donor.consentToContact ? "Yes" : "No"}
                </p>
              </div>
            </div>

            {donor.additionalNotes && (
              <>
                <Separator />
                <div>
                  <p className="text-sm text-gray-500 mb-1">Additional Notes</p>
                  <p className="text-gray-700">{donor.additionalNotes}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Status & Donation Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Donor Status</span>
                <Badge className={statusColors[donor.donorStatus]}>
                  {donor.donorStatus}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Verification</span>
                <Badge className={verificationColors[donor.verificationStatus]}>
                  {donor.verificationStatus}
                </Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Eligibility</span>
                <Badge
                  className={
                    isEligible
                      ? "bg-green-100 text-green-700"
                      : "bg-orange-100 text-orange-700"
                  }
                >
                  {isEligible ? "Eligible" : "Not Eligible"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Donation History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Last Donation</p>
                <p className="font-medium">
                  {donor.lastDonationDate
                    ? format(new Date(donor.lastDonationDate), "dd MMMM yyyy")
                    : "No record"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Next Eligible Date</p>
                <p
                  className={`font-medium ${
                    isEligible ? "text-green-600" : "text-orange-600"
                  }`}
                >
                  {donor.nextEligibleDate
                    ? format(new Date(donor.nextEligibleDate), "dd MMMM yyyy")
                    : "-"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Record Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Created</span>
                <span>{format(new Date(donor.createdAt), "dd MMM yyyy, HH:mm")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Updated</span>
                <span>{format(new Date(donor.updatedAt), "dd MMM yyyy, HH:mm")}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
