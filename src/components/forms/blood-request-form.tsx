"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bloodRequestSchema, type BloodRequestInput } from "@/lib/validations/blood-request";
import { submitBloodRequest } from "@/actions/blood-request";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, CheckCircle2, Copy } from "lucide-react";
import { toast } from "sonner";

interface BloodGroup {
  id: string;
  name: string;
  displayName: string;
}

interface BloodRequestFormProps {
  bloodGroups: BloodGroup[];
  contactPhone?: string;
}

export function BloodRequestForm({ bloodGroups, contactPhone = "+91 1234567890" }: BloodRequestFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState<string | null>(null);
  const [bgDisplay, setBgDisplay] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BloodRequestInput>({
    resolver: zodResolver(bloodRequestSchema),
    defaultValues: {
      willToDonate: false,
      isItEmployee: true,
      isUrgent: false,
    },
  });

  const willToDonateValue = watch("willToDonate");
  const isItEmployeeValue = watch("isItEmployee");
  const isUrgentValue = watch("isUrgent");

  const onSubmit = async (data: BloodRequestInput) => {
    setIsSubmitting(true);
    try {
      const result = await submitBloodRequest(data);
      if (result.success && result.referenceNumber) {
        setReferenceNumber(result.referenceNumber);
        toast.success("Blood request submitted successfully!");
      } else {
        toast.error(result.error || "Failed to submit request");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyReferenceNumber = () => {
    if (referenceNumber) {
      navigator.clipboard.writeText(referenceNumber);
      toast.success("Reference number copied!");
    }
  };

  if (referenceNumber) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-12 pb-12 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Request Submitted Successfully!
          </h2>
          <p className="text-gray-600 mb-6">
            Our team will review your request and contact you shortly.
          </p>

          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <p className="text-sm text-gray-500 mb-2">Your Reference Number</p>
            <div className="flex items-center justify-center gap-2">
              <p className="text-2xl font-mono font-bold text-primary">
                {referenceNumber}
              </p>
              <Button
                variant="ghost"
                size="icon"
                onClick={copyReferenceNumber}
                className="h-8 w-8"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Please save this number for future reference
            </p>
          </div>

          <p className="text-sm text-gray-500">
            For urgent assistance, please contact us directly at{" "}
            <a href={`tel:${contactPhone.replace(/\s/g, "")}`} className="text-primary font-medium">
              {contactPhone}
            </a>
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Blood Request Form</CardTitle>
        <CardDescription>
          All fields are required. Fill out the form below and our team will
          contact you to arrange assistance.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Your Details</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  placeholder="Enter first name"
                  className="bg-white text-gray-900"
                  {...register("firstName")}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-600">{errors.firstName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  placeholder="Enter last name"
                  className="bg-white text-gray-900"
                  {...register("lastName")}
                />
                {errors.lastName && (
                  <p className="text-sm text-red-600">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age *</Label>
                <Input
                  id="age"
                  type="number"
                  min={1}
                  max={120}
                  placeholder="Enter your age"
                  className="bg-white text-gray-900"
                  {...register("age", { valueAsNumber: true })}
                />
                {errors.age && (
                  <p className="text-sm text-red-600">{errors.age.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  className="bg-white text-gray-900"
                  {...register("phone")}
                />
                {errors.phone && (
                  <p className="text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Are you an IT Employee? *</Label>
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => setValue("isItEmployee", true)}
                    className={`w-full py-2 px-3 rounded-lg border-2 text-sm font-medium transition-colors text-left ${
                      isItEmployeeValue
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    IT Employee
                  </button>
                  <button
                    type="button"
                    onClick={() => setValue("isItEmployee", false)}
                    className={`w-full py-2 px-3 rounded-lg border-2 text-sm font-medium transition-colors text-left ${
                      !isItEmployeeValue
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    Non IT Employee
                  </button>
                </div>
                {errors.isItEmployee && (
                  <p className="text-sm text-red-600">{errors.isItEmployee.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  placeholder="Enter company name"
                  className="bg-white text-gray-900"
                  {...register("companyName")}
                />
                {errors.companyName && (
                  <p className="text-sm text-red-600">{errors.companyName.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Blood Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Blood Information</h3>

            <div className="space-y-2">
              <Label>Blood Group Required *</Label>
              <Select<string>
                onValueChange={(value) => {
                  if (!value) return;
                  setValue("bloodGroupId", value);
                  setBgDisplay(bloodGroups.find((b) => b.id === value)?.displayName ?? "");
                }}
              >
                <SelectTrigger className="bg-white text-gray-900">
                  <SelectValue placeholder="Select blood group">
                    {bgDisplay || undefined}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {bloodGroups.map((bg) => (
                    <SelectItem key={bg.id} value={bg.id}>
                      {bg.displayName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.bloodGroupId && (
                <p className="text-sm text-red-600">{errors.bloodGroupId.message}</p>
              )}
            </div>
          </div>

          {/* Request Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Request Details</h3>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Request *</Label>
              <Textarea
                id="reason"
                placeholder="Please describe why blood is needed (e.g., surgery, accident, medical condition)"
                rows={3}
                className="bg-white text-gray-900"
                {...register("reason")}
              />
              {errors.reason && (
                <p className="text-sm text-red-600">{errors.reason.message}</p>
              )}
            </div>
          </div>

          {/* Urgent checkbox */}
          <div className={`p-4 rounded-lg border-2 transition-colors ${isUrgentValue ? "bg-red-50 border-red-300" : "bg-gray-50 border-gray-200"}`}>
            <div className="flex items-start space-x-3">
              <Checkbox
                id="isUrgent"
                checked={isUrgentValue ?? false}
                onCheckedChange={(checked) => setValue("isUrgent", checked === true)}
              />
              <div className="space-y-1">
                <Label htmlFor="isUrgent" className={`font-semibold cursor-pointer ${isUrgentValue ? "text-red-700" : "text-gray-900"}`}>
                  This is an Urgent / Emergency request
                </Label>
                <p className="text-sm text-gray-500">
                  Check this if blood is needed immediately. This will flag the request as urgent in our system and alert our team right away.
                </p>
              </div>
            </div>
          </div>

          {/* Consent */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="willToDonate"
                checked={willToDonateValue}
                onCheckedChange={(checked) =>
                  setValue("willToDonate", checked === true)
                }
              />
              <div className="space-y-1">
                <Label htmlFor="willToDonate" className="font-medium cursor-pointer">
                  I confirm that the above information is accurate and I consent to being contacted regarding this blood request *
                </Label>
                <p className="text-sm text-gray-500">
                  By checking this box, you agree that Blood Connect may contact
                  you to follow up on this request and coordinate assistance.
                </p>
              </div>
            </div>
            {errors.willToDonate && (
              <p className="text-sm text-red-600 mt-2">{errors.willToDonate.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting Request...
              </>
            ) : (
              "Submit Blood Request"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
