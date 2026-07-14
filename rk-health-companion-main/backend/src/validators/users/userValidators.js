import { z } from "zod";

const bloodGroupSchema = z.union([
  z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]),
  z.null(),
]).optional();

const lifestyleSchema = z.union([
  z.enum(["Active", "Moderately Active", "Sedentary", "Athlete", "Other"]),
  z.null(),
]).optional();

const nullableNumberSchema = (min, max) =>
  z.preprocess((value) => {
    if (value === undefined) return undefined;
    if (value === null || value === "") return null;
    const normalized = Number(value);
    return Number.isNaN(normalized) ? value : normalized;
  }, z.union([z.number().min(min).max(max), z.null()]).optional());

const nullableTextSchema = (maxLength) =>
  z.preprocess((value) => {
    if (value === undefined) return undefined;
    if (value === null || String(value).trim() === "") return null;
    return String(value).trim();
  }, z.union([z.string().max(maxLength), z.null()]).optional());

export const updateProfileSchema = z.object({
  body: z.object({
    fullName: z
      .string()
      .trim()
      .min(2, "Full name must be at least 2 characters long")
      .optional(),
    phone: z
      .string()
      .optional(),
    dateOfBirth: z
      .string()
      .optional(),
    gender: z
      .enum(["Male", "Female", "Other"])
      .optional(),
    profileImage: z
      .string()
      .optional(),
    bloodGroup: bloodGroupSchema,
    height: nullableNumberSchema(50, 250),
    weight: nullableNumberSchema(10, 300),
    allergies: nullableTextSchema(1000),
    medicalConditions: nullableTextSchema(1000),
    insurance: nullableTextSchema(100),
    insuranceProvider: nullableTextSchema(100),
    bmi: z.preprocess((value) => {
      if (value === undefined) return undefined;
      if (value === null || value === "") return null;
      const normalized = Number(value);
      return Number.isNaN(normalized) ? value : normalized;
    }, z.union([z.number(), z.null()]).optional()),
    lifestyle: lifestyleSchema,
    emergencyContactName: z
      .string()
      .optional(),
    emergencyContactPhone: z
      .string()
      .optional(),
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z
      .string({ required_error: "Current password is required" }),
    newPassword: z
      .string({ required_error: "New password is required" })
      .min(6, "New password must be at least 6 characters long"),
    confirmPassword: z
      .string({ required_error: "Confirm password is required" }),
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords do not match",
    path: ["confirmPassword"],
  }),
});
