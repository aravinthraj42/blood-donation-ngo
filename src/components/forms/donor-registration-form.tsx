"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { donorRegistrationSchema, type DonorRegistrationInput } from "@/lib/validations/donor";
import { registerDonor } from "@/actions/donor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, CheckCircle2 } from "lucide-react";
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
  const [bgDisplay, setBgDisplay] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<DonorRegistrationInput>({
    resolver: zodResolver(donorRegistrationSchema),
    defaultValues: {
      consentToContact: false,
      isItEmployee: true,
    },
  });

  const consentValue = watch("consentToContact");
  const isItEmployeeValue = watch("isItEmployee");

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
          <p className="text-gray-600 max-w-md mx-auto">
            Your registration has been received. Our team will verify your
            information and contact you soon.
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
          All fields are required. Fill out the form below to register as a blood donor.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Personal Information</h3>

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
                  min={18}
                  max={65}
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
                  placeholder="Enter your Phone Number"
                  maxLength={10}
                  className="bg-white text-gray-900"
                  {...register("phone")}
                />
                {errors.phone && (
                  <p className="text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Blood Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Blood Information</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Blood Group *</Label>
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

              <div className="space-y-2">
                <Label htmlFor="lastDonationDate">
                  Last Donation Date *{" "}
                  <span className="text-xs font-normal text-gray-400">(DD/MM/YYYY)</span>
                </Label>
                <Input
                  id="lastDonationDate"
                  type="date"
                  className="bg-white text-gray-900"
                  {...register("lastDonationDate")}
                />
                {errors.lastDonationDate && (
                  <p className="text-sm text-red-600">{errors.lastDonationDate.message}</p>
                )}
                <p className="text-xs text-blue-600 bg-blue-50 rounded px-2 py-1">
                  You will be eligible to donate again after 90 days from your last donation date.
                </p>
                <p className="text-xs text-gray-500">
                  If you have never donated, enter today&apos;s date
                </p>
              </div>
            </div>
          </div>

          {/* Work Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Work Information</h3>

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

          {/* Consent */}
          <div className="p-4 bg-gray-50 rounded-lg">
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
                  I am willing to donate blood *
                </Label>
                <p className="text-sm text-gray-500">
                  By checking this box, you confirm your willingness to be contacted
                  when there is a blood donation requirement matching your profile.
                </p>
              </div>
            </div>
            {errors.consentToContact && (
              <p className="text-sm text-red-600 mt-2">{errors.consentToContact.message}</p>
            )}
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
