import { z } from "zod";

export const donorRegistrationSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .min(2, "Name must be at least 2 characters")
    .max(255, "Name must be less than 255 characters"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^[+]?[\d\s-]{10,20}$/, "Please enter a valid phone number"),
  email: z
    .string()
    .email("Please enter a valid email")
    .optional()
    .or(z.literal("")),
  bloodGroupId: z.string().uuid("Please select a blood group"),
  dateOfBirth: z.string().optional().or(z.literal("")),
  lastDonationDate: z
    .string()
    .min(1, "Last donation date is required"),
  address: z
    .string()
    .min(1, "Address is required")
    .max(500, "Address must be less than 500 characters"),
  city: z
    .string()
    .min(1, "City is required")
    .max(100, "City must be less than 100 characters"),
  district: z
    .string()
    .min(1, "District is required")
    .max(100, "District must be less than 100 characters"),
  state: z
    .string()
    .min(1, "State is required")
    .max(100, "State must be less than 100 characters"),
  pincode: z
    .string()
    .min(1, "Pincode is required")
    .regex(/^\d{6}$/, "Please enter a valid 6-digit pincode"),
  occupation: z.string().max(255).optional().or(z.literal("")),
  preferredContactMethod: z.enum(["PHONE", "WHATSAPP", "EMAIL"]),
  additionalNotes: z.string().max(1000).optional().or(z.literal("")),
  consentToContact: z
    .boolean()
    .refine((val) => val === true, {
      message: "You must agree to be contacted for blood donation requests",
    }),
});

export type DonorRegistrationInput = z.infer<typeof donorRegistrationSchema>;
