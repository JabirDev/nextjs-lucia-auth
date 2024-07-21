import { z } from "zod";

const requiredString = z.string().trim().min(1, { message: "Required" });
const disallowedPatterns = [
  "admin",
  "superuser",
  "superadmin",
  "root",
  "jabirdev",
];

export const signUpSchema = z.object({
  email: requiredString.email({ message: "Invalid email address" }),
  username: requiredString
    .regex(/^[a-zA-Z0-0_-]+$/, "Only letters, numbers, - and _ allowed")
    .refine(
      (username) => {
        for (const pattern of disallowedPatterns) {
          if (username.toLowerCase().includes(pattern)) {
            return false;
          }
        }
        return true;
      },
      { message: "Username contains disallowed words" }
    ),
  password: requiredString.min(8, { message: "Must be at least 8 characters" }),
});

export type SignUpValues = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  username: requiredString,
  password: requiredString,
});

export type SignInValues = z.infer<typeof signInSchema>;
