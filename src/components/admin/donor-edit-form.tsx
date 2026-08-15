"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { updateDonor } from "@/actions/admin-donor";
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
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

const donorEditSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  age: z.number({ invalid_type_error: "Age is required" }).int().min(1).max(120),
  phone: z.string().min(1, "Phone number is required"),
  bloodGroupId: z.string().uuid("Please select a blood group"),
  lastDonationDate: z.string().min(1, "Last donation date is required"),
  isItEmployee: z.boolean(),
  companyName: z.string().min(1, "Company name is required"),
  consentToContact: z.boolean(),
});

type DonorEditInput = z.infer<typeof donorEditSchema>;

interface BloodGroup {
  id: string;
  name: string;
  displayName: string;
}

interface DonorEditFormProps {
  donorId: string;
  defaultValues: DonorEditInput;
  bloodGroups: BloodGroup[];
  currentBloodGroupDisplay: string;
}

export function DonorEditForm({
  donorId,
  defaultValues,
  bloodGroups,
  currentBloodGroupDisplay,
}: DonorEditFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bgDisplay, setBgDisplay] = useState(currentBloodGroupDisplay);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<DonorEditInput>({
    resolver: zodResolver(donorEditSchema),
    defaultValues,
  });

  const isItEmployeeValue = watch("isItEmployee");
  const consentValue = watch("consentToContact");

  const onSubmit = async (data: DonorEditInput) => {
    setIsSubmitting(true);
    try {
      const result = await updateDonor(donorId, data);
      if (result.success) {
        toast.success("Donor updated successfully");
        router.push(`/admin/donors/${donorId}`);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update donor");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Personal Information */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">Personal Information</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name *</Label>
            <Input id="firstName" className="bg-white" {...register("firstName")} />
            {errors.firstName && <p className="text-sm text-red-600">{errors.firstName.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name *</Label>
            <Input id="lastName" className="bg-white" {...register("lastName")} />
            {errors.lastName && <p className="text-sm text-red-600">{errors.lastName.message}</p>}
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
              className="bg-white"
              {...register("age", { valueAsNumber: true })}
            />
            {errors.age && <p className="text-sm text-red-600">{errors.age.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input id="phone" placeholder="10-digit mobile number" maxLength={10} className="bg-white" {...register("phone")} />
            {errors.phone && <p className="text-sm text-red-600">{errors.phone.message}</p>}
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
              defaultValue={defaultValues.bloodGroupId}
              onValueChange={(value) => {
                if (!value) return;
                setValue("bloodGroupId", value);
                setBgDisplay(bloodGroups.find((b) => b.id === value)?.displayName ?? "");
              }}
            >
              <SelectTrigger className="bg-white">
                <SelectValue>{bgDisplay || "Select blood group"}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {bloodGroups.map((bg) => (
                  <SelectItem key={bg.id} value={bg.id}>
                    {bg.displayName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.bloodGroupId && <p className="text-sm text-red-600">{errors.bloodGroupId.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastDonationDate">
              Last Donation Date *{" "}
              <span className="text-xs font-normal text-gray-400">(DD/MM/YYYY)</span>
            </Label>
            <Input
              id="lastDonationDate"
              type="date"
              className="bg-white"
              {...register("lastDonationDate")}
            />
            {errors.lastDonationDate && <p className="text-sm text-red-600">{errors.lastDonationDate.message}</p>}
            <p className="text-xs text-blue-600 bg-blue-50 rounded px-2 py-1">
              Eligible to donate again after 90 days from last donation date.
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name *</Label>
            <Input id="companyName" className="bg-white" {...register("companyName")} />
            {errors.companyName && <p className="text-sm text-red-600">{errors.companyName.message}</p>}
          </div>
        </div>
      </div>

      {/* Consent */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="flex items-start space-x-3">
          <Checkbox
            id="consentToContact"
            checked={consentValue}
            onCheckedChange={(checked) => setValue("consentToContact", checked === true)}
          />
          <Label htmlFor="consentToContact" className="font-medium cursor-pointer">
            Willing to donate blood
          </Label>
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(`/admin/donors/${donorId}`)}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
