import z from "zod";

export const profileSchema = z.object({
  employeeNumber: z.string().min(1, 'Employee number is required'),
  department: z.string().min(1, 'Department is required'),
  firstName: z.string().min(3, 'First name must be at least 3 characters').max(100, 'First name cannot exceed 100 characters'),
  lastName: z.string().min(3, 'Last name must be at least 3 characters').max(100, 'Last name cannot exceed 100 characters'),
  postalCode: z.string().length(7, 'Postal code must be exactly 7 characters'),
  address: z.string().min(1, 'Address is required'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  birthday: z.date(),
  remarks: z.string().optional(),
  profileImage: z.string().optional(),
  userId: z.string().optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
