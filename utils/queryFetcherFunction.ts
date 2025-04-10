import ky, { Options } from "ky";

export default async function queryFetcherFunction<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends Record<string, any>,
>(url: string, opts?: Options) {
  type Final = T extends { error: string } | { errors: string[] } ? never : T;
  const response = await ky.get<T>(url, { throwHttpErrors: false, ...opts });
  const data = await response.json();

  if ("error" in data) throw new Error(data.error);
  if ("errors" in data) throw new Error(data.errors[0]);
  return data as Final;
}
