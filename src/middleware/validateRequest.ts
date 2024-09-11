import { AnyObjectSchema } from "yup";
import { NextRequest, NextResponse } from "next/server";

export const validateRequest = async (
  req: NextRequest,
  schema: AnyObjectSchema
) => {
  try {
    const body = await req.json();

    await schema.validate(body, { abortEarly: false });

    return { isValid: true, body };
  } catch (validationError: any) {
    const errors = validationError.inner.map((err: any) => ({
      path: err.path,
      message: err.message,
    }));
    return { isValid: false, errors };
  }
};
