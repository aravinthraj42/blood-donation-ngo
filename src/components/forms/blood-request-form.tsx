"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bloodRequestSchema, type BloodRequestInput } from "@/lib/validations/blood-request";
import { submitBloodRequest } from "@/actions/blood-request";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, CheckCircle2, AlertTriangle, Copy } from "lucide-react";
import { toast } from "sonner";

interface BloodGroup {
  id: string;
  name: string;
  displayName: string;
}

interface BloodRequestFormProps {
  bloodGroups: BloodGroup[];
}

export function BloodRequestForm({ bloodGroups }: BloodRequestFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BloodRequestInput>({
    resolver: zodResolver(bloodRequestSchema),
    defaultValues: {
      urgency: "NORMAL",
      unitsRequired: 1,
    },
  });

  const urgencyValue = watch("urgency");

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
            <a href="tel:+911234567890" className="text-primary font-medium">
              +91 1234567890
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
          Fill out the form below to request blood. Our team will contact you
          to arrange assistance.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Urgency Selection */}
          <div className="space-y-2">
            <Label>Urgency Level *</Label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "NORMAL", label: "Normal", color: "border-gray-200 bg-gray-50" },
                { value: "URGENT", label: "Urgent", color: "border-orange-200 bg-orange-50" },
                { value: "EMERGENCY", label: "Emergency", color: "border-red-200 bg-red-50" },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setValue("urgency", option.value as "NORMAL" | "URGENT" | "EMERGENCY")}
                  className={`p-3 rounded-lg border-2 text-center transition-colors ${
                    urgencyValue === option.value
                      ? option.value === "EMERGENCY"
                        ? "border-red-500 bg-red-100"
                        : option.value === "URGENT"
                        ? "border-orange-500 bg-orange-100"
                        : "border-primary bg-primary/10"
                      : option.color
                  }`}
                >
                  <span className="font-medium">{option.label}</span>
                </button>
              ))}
            </div>
            {urgencyValue === "EMERGENCY" && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-800">
                  For life-threatening emergencies, please also contact the
                  hospital blood bank and call our emergency line.
                </p>
              </div>
            )}
          </div>

          {/* Patient Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Patient Information</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patientName">Patient Name *</Label>
                <Input
                  id="patientName"
                  placeholder="Patient's full name"
                  {...register("patientName")}
                />
                {errors.patientName && (
                  <p className="text-sm text-red-600">{errors.patientName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bloodGroupId">Blood Group Required *</Label>
                <Select<string> onValueChange={(value) => value && setValue("bloodGroupId", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood group" />
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="unitsRequired">Units Required *</Label>
                <Input
                  id="unitsRequired"
                  type="number"
                  min={1}
                  max={10}
                  {...register("unitsRequired", { valueAsNumber: true })}
                />
                {errors.unitsRequired && (
                  <p className="text-sm text-red-600">{errors.unitsRequired.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason / Procedure</Label>
                <Input
                  id="reason"
                  placeholder="e.g., Surgery, Accident, etc."
                  {...register("reason")}
                />
              </div>
            </div>
          </div>

          {/* Hospital Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Hospital Information</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hospitalName">Hospital Name *</Label>
                <Input
                  id="hospitalName"
                  placeholder="Hospital name"
                  {...register("hospitalName")}
                />
                {errors.hospitalName && (
                  <p className="text-sm text-red-600">{errors.hospitalName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="hospitalLocation">Hospital Location *</Label>
                <Input
                  id="hospitalLocation"
                  placeholder="Address / Area"
                  {...register("hospitalLocation")}
                />
                {errors.hospitalLocation && (
                  <p className="text-sm text-red-600">{errors.hospitalLocation.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="requiredDate">Required Date *</Label>
                <Input
                  id="requiredDate"
                  type="date"
                  {...register("requiredDate")}
                />
                {errors.requiredDate && (
                  <p className="text-sm text-red-600">{errors.requiredDate.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="requiredTime">Required Time</Label>
                <Input
                  id="requiredTime"
                  type="time"
                  {...register("requiredTime")}
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Contact Information</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="requesterName">Your Name *</Label>
                <Input
                  id="requesterName"
                  placeholder="Your full name"
                  {...register("requesterName")}
                />
                {errors.requesterName && (
                  <p className="text-sm text-red-600">{errors.requesterName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact Phone *</Label>
                <Input
                  id="contactPhone"
                  placeholder="+91 9876543210"
                  {...register("contactPhone")}
                />
                {errors.contactPhone && (
                  <p className="text-sm text-red-600">{errors.contactPhone.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="alternativeContact">Alternative Contact</Label>
                <Input
                  id="alternativeContact"
                  placeholder="+91 9876543210"
                  {...register("alternativeContact")}
                />
                {errors.alternativeContact && (
                  <p className="text-sm text-red-600">{errors.alternativeContact.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="pocName">Hospital POC Name</Label>
                <Input
                  id="pocName"
                  placeholder="Point of contact at hospital"
                  {...register("pocName")}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pocPhone">Hospital POC Phone</Label>
              <Input
                id="pocPhone"
                placeholder="+91 9876543210"
                {...register("pocPhone")}
              />
              {errors.pocPhone && (
                <p className="text-sm text-red-600">{errors.pocPhone.message}</p>
              )}
            </div>
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
