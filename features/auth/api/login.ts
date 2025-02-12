import ky from "ky";
import { LoginAPIResponse } from "@/app/api";

type LoginMutationFunctionProps = {
  email: string;
  password: string;
};
export async function loginFunction({
  email,
  password,
}: LoginMutationFunctionProps) {
  const result = await ky.post<LoginAPIResponse>("/api/auth/login", {
    json: {
      email,
      password,
    },
    throwHttpErrors: false,
  });

  const data = await result.json();

  if (result.status !== 200) {
    if ("errors" in data) throw new Error(data.errors[0]);
    if ("error" in data) throw new Error(data.error);
  }

  return data;
}
