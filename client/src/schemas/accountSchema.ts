import z from "zod";

const accountVerificationSchema = z.object({
  email: z.string().email("Invalid email address"),
  tempPassword: z
    .string()
    .min(8, "Temporary password must be at least 8 characters"),
});

const profileSetupSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
    employeeNumber: z
      .string()
      .min(3, "Employee number must be at least 3 characters"),
    department: z.string().optional(),
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    postalCode: z.string().optional(),
    phoneNumber: z.string().optional(),
    address: z.string().optional(),
    birthday: z.string().optional(),
    notes: z.string().optional(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const fullFormSchema = accountVerificationSchema.merge(profileSetupSchema);

export type FormData = z.infer<typeof fullFormSchema>;