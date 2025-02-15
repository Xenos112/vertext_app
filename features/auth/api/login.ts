import ky from "ky";
import { LoginAPIResponse } from "@/app/api";
import formatZodErrors from "@/utils/format-zod-errors";
import { LOGIN_VALIDATOR } from "../validators/login";

type LoginMutationFunctionProps = {
  email: string;
  password: string;
};

export async function loginFunction({
  email,
  password,
}: LoginMutationFunctionProps) {
  if (!password || !email) {
    throw new Error("Please Fill all the inputs");
  }

  const {
    error,
    data: parsedData,
    success,
  } = LOGIN_VALIDATOR.safeParse({ email, password });

  if (!success) {
    const errors = formatZodErrors(error);
    throw new Error(errors[0]);
  }

  const result = await ky.post<LoginAPIResponse>("/api/auth/login", {
    json: parsedData,
    throwHttpErrors: false,
  });

  const data = await result.json();

  if (result.status !== 200) {
    if ("errors" in data) throw new Error(data.errors[0]);
    if ("error" in data) throw new Error(data.error);
  }

  return data;
}
