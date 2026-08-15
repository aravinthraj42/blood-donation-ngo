import { z } from "zod";

const phoneSchema = z
  .string()
  .min(1, "Phone number is required")
  .regex(/^\d{10}$/, "Phone number must be exactly 10 digits")
  .refine((val) => {
    const isSequential = val === "1234567890" || val === "0987654321";
    const isAllSame = /^(\d)\1+$/.test(val);
    return !isSequential && !isAllSame;
  }, "Please enter a valid phone number");

export const bloodRequestSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(100, "First name must be less than 100 characters"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(100, "Last name must be less than 100 characters"),
  age: z
    .number({ invalid_type_error: "Age is required" })
    .int("Age must be a whole number")
    .min(1, "Please enter a valid age")
    .max(120, "Please enter a valid age"),
  bloodGroupId: z.string().uuid("Please select a blood group required"),
  willToDonate: z
    .boolean()
    .refine((val) => val === true, {
      message: "You must confirm willingness to donate",
    }),
  phone: phoneSchema,
  isItEmployee: z.boolean({ required_error: "Please indicate if you are an IT employee" }),
  companyName: z
    .string()
    .min(1, "Company name is required")
    .max(255, "Company name must be less than 255 characters"),
  reason: z
    .string()
    .min(1, "Reason for request is required")
    .max(500, "Reason must be less than 500 characters"),
  isUrgent: z.boolean().optional(),
});

export type BloodRequestInput = z.infer<typeof bloodRequestSchema>;
