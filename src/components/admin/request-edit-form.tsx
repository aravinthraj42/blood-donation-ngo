"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { updateBloodRequest } from "@/actions/admin-request";
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
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

const requestEditSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  age: z.number({ invalid_type_error: "Age is required" }).int().min(1).max(120),
  phone: z.string().min(1, "Phone number is required"),
  bloodGroupId: z.string().uuid("Please select a blood group"),
  isItEmployee: z.boolean(),
  companyName: z.string().min(1, "Company name is required"),
  reason: z.string().min(1, "Reason is required"),
  isUrgent: z.boolean(),
  willToDonate: z.boolean(),
});

type RequestEditInput = z.infer<typeof requestEditSchema>;

interface BloodGroup {
  id: string;
  name: string;
  displayName: string;
}

interface RequestEditFormProps {
  requestId: string;
  defaultValues: RequestEditInput;
  bloodGroups: BloodGroup[];
  currentBloodGroupDisplay: string;
}

export function RequestEditForm({
  requestId,
  defaultValues,
  bloodGroups,
  currentBloodGroupDisplay,
}: RequestEditFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bgDisplay, setBgDisplay] = useState(currentBloodGroupDisplay);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RequestEditInput>({
    resolver: zodResolver(requestEditSchema),
    defaultValues,
  });

  const isItEmployeeValue = watch("isItEmployee");
  const isUrgentValue = watch("isUrgent");
  const willToDonateValue = watch("willToDonate");

  const onSubmit = async (data: RequestEditInput) => {
    setIsSubmitting(true);
    try {
      const result = await updateBloodRequest(requestId, data);
      if (result.success) {
        toast.success("Blood request updated successfully");
        router.push(`/admin/requests/${requestId}`);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update blood request");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Requester Information */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">Requester Information</h3>

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

        <div className="space-y-2">
          <Label>Blood Group Required *</Label>
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
          <Label htmlFor="reason">Reason for Request *</Label>
          <Textarea
            id="reason"
            rows={3}
            className="bg-white"
            {...register("reason")}
          />
          {errors.reason && <p className="text-sm text-red-600">{errors.reason.message}</p>}
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

      {/* Flags */}
      <div className="p-4 bg-gray-50 rounded-lg space-y-3">
        <div className="flex items-center space-x-3">
          <Checkbox
            id="isUrgent"
            checked={isUrgentValue}
            onCheckedChange={(checked) => setValue("isUrgent", checked === true)}
          />
          <Label htmlFor="isUrgent" className="font-medium cursor-pointer text-red-700">
            Urgent / Emergency
          </Label>
        </div>
        <div className="flex items-center space-x-3">
          <Checkbox
            id="willToDonate"
            checked={willToDonateValue}
            onCheckedChange={(checked) => setValue("willToDonate", checked === true)}
          />
          <Label htmlFor="willToDonate" className="font-medium cursor-pointer">
            Willing to donate blood in the future
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
          onClick={() => router.push(`/admin/requests/${requestId}`)}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
