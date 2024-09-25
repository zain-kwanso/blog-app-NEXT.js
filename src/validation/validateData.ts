import { NextRequest } from "next/server";
import { z } from "zod";

// Update the function to use Zod
export const validateRequest = async <T extends z.ZodTypeAny>(
  req: NextRequest,
  schema: T
) => {
  try {
    const body = await req.json();

    const result = schema.safeParse(body);

    if (!result.success) {
      const errors = result.error.errors.map((err) => ({
        path: err.path.join("."),
        message: err.message,
      }));
      return { isValid: false, errors };
    }

    return { isValid: true, body: result.data };
  } catch (error) {
    return { isValid: false, errors: [{ message: "Invalid request body" }] };
  }
};

export const validateFormData = async <T extends z.ZodTypeAny>(
  schema: T,
  formData: FormData
) => {
  const data: Record<string, string> = {};

  formData.forEach((value, key) => {
    data[key] = value.toString();
  });

  try {
    const parsedData = schema.parse(data);
    return { isValid: true, body: parsedData };
  } catch (error) {
    return { isValid: false, errors: [{ message: "Invalid data body" }] };
  }
};
