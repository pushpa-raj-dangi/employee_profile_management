import z from "zod";

export const companySchema = z.object({
  name: z
    .string()
    .min(5, "Company name must be at least 5 characters")
    .max(255),
  zipCode: z.string().min(1, "Zip code is required"),
  address: z.string().min(1, "Address is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email address").min(5).max(255),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  establishmentDate: z.date(),
  remarks: z.string().optional(),
  images: z.array(z.string()).default([]), // Add this line
});

export type CompanyFormData = z.infer<typeof companySchema>;
export type CreateCompanyInput = z.infer<typeof companySchema>;
