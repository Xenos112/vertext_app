import { z } from "zod";

export default function formatZodErrors(errors: z.ZodError) {
  const resolvedErrors = errors.issues.map((error) => error.message);
  return resolvedErrors;
}
