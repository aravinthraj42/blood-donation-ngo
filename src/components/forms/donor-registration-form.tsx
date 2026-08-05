"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { donorRegistrationSchema, type DonorRegistrationInput } from "@/lib/validations/donor";
import { registerDonor } from "@/actions/donor";
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
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface BloodGroup {
  id: string;
  name: string;
  displayName: string;
}

interface DonorRegistrationFormProps {
  bloodGroups: BloodGroup[];
}

export function DonorRegistrationForm({ bloodGroups }: DonorRegistrationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<DonorRegistrationInput>({
    resolver: zodResolver(donorRegistrationSchema),
    defaultValues: {
      preferredContactMethod: "PHONE",
      consentToContact: false,
    },
  });

  const consentValue = watch("consentToContact");

  const onSubmit = async (data: DonorRegistrationInput) => {
    setIsSubmitting(true);
    try {
      const result = await registerDonor(data);
      if (result.success) {
        setIsSuccess(true);
        toast.success("Registration successful! We will contact you soon.");
      } else {
        toast.error(result.error || "Registration failed");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-12 pb-12 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Thank You for Registering!
          </h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Your registration has been received. Our team will verify your
            information and contact you soon.
          </p>
          <p className="text-sm text-gray-500">
            <strong>Note:</strong> Final eligibility for blood donation will be
            determined by qualified healthcare professionals during screening.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Donor Registration</CardTitle>
        <CardDescription>
          Fill out the form below to register as a blood donor. Fields marked
          with * are required.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Personal Information</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  placeholder="Enter your full name"
                  {...register("fullName")}
                />
                {errors.fullName && (
                  <p className="text-sm text-red-600">{errors.fullName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  placeholder="+91 9876543210"
                  {...register("phone")}
                />
                {errors.phone && (
                  <p className="text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  {...register("dateOfBirth")}
                />
                {errors.dateOfBirth && (
                  <p className="text-sm text-red-600">{errors.dateOfBirth.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="occupation">Occupation / Company</Label>
              <Input
                id="occupation"
                placeholder="Your occupation or company name"
                {...register("occupation")}
              />
            </div>
          </div>

          {/* Blood Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Blood Information</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bloodGroupId">Blood Group *</Label>
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

              <div className="space-y-2">
                <Label htmlFor="lastDonationDate">Last Donation Date *</Label>
                <Input
                  id="lastDonationDate"
                  type="date"
                  {...register("lastDonationDate")}
                />
                {errors.lastDonationDate && (
                  <p className="text-sm text-red-600">{errors.lastDonationDate.message}</p>
                )}
                <p className="text-xs text-gray-500">
                  If never donated, enter today&apos;s date
                </p>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Address</h3>

            <div className="space-y-2">
              <Label htmlFor="address">Street Address *</Label>
              <Textarea
                id="address"
                placeholder="Enter your complete address"
                rows={2}
                {...register("address")}
              />
              {errors.address && (
                <p className="text-sm text-red-600">{errors.address.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input id="city" placeholder="City" {...register("city")} />
                {errors.city && (
                  <p className="text-sm text-red-600">{errors.city.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="district">District *</Label>
                <Input
                  id="district"
                  placeholder="District"
                  {...register("district")}
                />
                {errors.district && (
                  <p className="text-sm text-red-600">{errors.district.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Input id="state" placeholder="State" {...register("state")} />
                {errors.state && (
                  <p className="text-sm text-red-600">{errors.state.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="pincode">Pincode *</Label>
                <Input
                  id="pincode"
                  placeholder="000000"
                  maxLength={6}
                  {...register("pincode")}
                />
                {errors.pincode && (
                  <p className="text-sm text-red-600">{errors.pincode.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Preferences */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Contact Preferences</h3>

            <div className="space-y-2">
              <Label>Preferred Contact Method *</Label>
              <Select<string>
                defaultValue="PHONE"
                onValueChange={(value) =>
                  value && setValue("preferredContactMethod", value as "PHONE" | "WHATSAPP" | "EMAIL")
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PHONE">Phone Call</SelectItem>
                  <SelectItem value="WHATSAPP">WhatsApp</SelectItem>
                  <SelectItem value="EMAIL">Email</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalNotes">Additional Notes</Label>
              <Textarea
                id="additionalNotes"
                placeholder="Any additional information you'd like to share"
                rows={3}
                {...register("additionalNotes")}
              />
            </div>
          </div>

          {/* Consent */}
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="consentToContact"
                checked={consentValue}
                onCheckedChange={(checked) =>
                  setValue("consentToContact", checked === true)
                }
              />
              <div className="space-y-1">
                <Label htmlFor="consentToContact" className="font-medium cursor-pointer">
                  I agree to be contacted for blood donation requests *
                </Label>
                <p className="text-sm text-gray-500">
                  By checking this box, you consent to be contacted by the NGO
                  when there is a blood donation requirement matching your
                  profile.
                </p>
              </div>
            </div>
            {errors.consentToContact && (
              <p className="text-sm text-red-600">{errors.consentToContact.message}</p>
            )}
          </div>

          {/* Disclaimer */}
          <div className="flex items-start gap-2 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800">
              <strong>Medical Disclaimer:</strong> Final eligibility for blood
              donation will be determined by qualified healthcare professionals
              during the screening process.
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Registering...
              </>
            ) : (
              "Register as Donor"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
