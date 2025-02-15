import ky from "ky";
import {
  FORGET_PASSWORD_CONFIRM_VALIDATOR,
  FORGET_PASSWORD_VALIDATOR,
} from "../validators/forget-password";
import formatZodErrors from "@/utils/format-zod-errors";
import {
  ForgetPasswordAPIResponse,
  ForgetPasswordConfirmationApiResponse,
} from "@/app/api";

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

type ResetPasswordProps = {
  id: string;
  password: string;
  confirmPassword: string;
};
export async function resetPasswordFunction({
  id,
  password,
  confirmPassword,
}: ResetPasswordProps) {
  if (password !== confirmPassword) {
    throw new Error("Password don't Match the Confirm Password");
  }

  const { success, data, error } = FORGET_PASSWORD_CONFIRM_VALIDATOR.safeParse({
    id,
    password,
  });
  if (!success) {
    const errors = formatZodErrors(error);
    throw new Error(errors[0]);
  }

  const res = await ky.post<ForgetPasswordConfirmationApiResponse>(
    "/api/auth/forget-password/confirmation",
    {
      json: data,
      throwHttpErrors: false,
    },
  );

  const responseData = await res.json();

  // FIX: the endpoint shoult only send a error not errors and if that in the case i should format the zod error to have only one error at the time conbined and send back to the client
  if (res.status !== 200) {
    throw new Error(responseData!.error!);
  }

  return responseData;
}
