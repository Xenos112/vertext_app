import ky from "ky";
import { RegisterApiResponse } from "@/app/api";

type RegisterMutationFunctionProps = {
  email: string;
  password: string;
  user_name: string;
};

// TODO: make a client side data parsing
export async function registerFunction({
  email,
  password,
  user_name,
}: RegisterMutationFunctionProps) {
  if (!password || !email || !user_name) {
    throw new Error("Please Fill all the inputs");
  }
  const result = await ky.post<RegisterApiResponse>("/api/auth/register", {
    json: {
      email,
      password,
      user_name,
    },
    throwHttpErrors: false,
  });

  const data = await result.json();

  if (result.status !== 201) {
    if ("errors" in data) throw new Error(data.errors[0]);
    if ("error" in data) throw new Error(data.error);
  }

  return data;
}
