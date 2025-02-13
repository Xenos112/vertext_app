import ky from "ky";
import { FORGET_PASSWORD_VALIDATOR } from "../validators/forget-password";
import formatZodErrors from "@/utils/format-zod-errors";
import { ForgetPasswordAPIResponse } from "@/app/api";
import { warn } from "console";

export default async function forgetPasswordFunction({
  email,
}: {
  email: string;
}) {
  const {
    data: requestBody,
    error,
    success,
  } = FORGET_PASSWORD_VALIDATOR.safeParse({
    email,
  });

  if (!success) {
    const errors = formatZodErrors(error);
    throw new Error(errors[0]);
  }

  const res = await ky.post<ForgetPasswordAPIResponse>(
    "/api/auth/forget-password",
    {
      json: requestBody,
      throwHttpErrors: false,
    },
  );

  const data = await res.json();
  if (res.status !== 200) {
    throw new Error(data.error!);
  } else return data.message!;
}
