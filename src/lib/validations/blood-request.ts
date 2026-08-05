import { z } from "zod";

export const bloodRequestSchema = z.object({
  requesterName: z
    .string()
    .min(1, "Your name is required")
    .max(255, "Name must be less than 255 characters"),
  patientName: z
    .string()
    .min(1, "Patient name is required")
    .max(255, "Name must be less than 255 characters"),
  bloodGroupId: z.string().uuid("Please select a blood group"),
  unitsRequired: z
    .number()
    .min(1, "At least 1 unit is required")
    .max(10, "Maximum 10 units can be requested at once"),
  reason: z.string().max(500).optional().or(z.literal("")),
  hospitalName: z
    .string()
    .min(1, "Hospital name is required")
    .max(255, "Hospital name must be less than 255 characters"),
  hospitalLocation: z
    .string()
    .min(1, "Hospital location is required")
    .max(500, "Location must be less than 500 characters"),
  requiredDate: z.string().min(1, "Required date is required"),
  requiredTime: z.string().optional().or(z.literal("")),
  contactPhone: z
    .string()
    .min(1, "Contact phone is required")
    .regex(/^[+]?[\d\s-]{10,20}$/, "Please enter a valid phone number"),
  alternativeContact: z
    .string()
    .regex(/^[+]?[\d\s-]{10,20}$/, "Please enter a valid phone number")
    .optional()
    .or(z.literal("")),
  pocName: z.string().max(255).optional().or(z.literal("")),
  pocPhone: z
    .string()
    .regex(/^[+]?[\d\s-]{10,20}$/, "Please enter a valid phone number")
    .optional()
    .or(z.literal("")),
  urgency: z.enum(["NORMAL", "URGENT", "EMERGENCY"]),
});

export type BloodRequestInput = z.infer<typeof bloodRequestSchema>;
