import ky from "ky";
import { ShareAPIResponse } from '@/app/api'

export default async function shareMutationFunction(id: string) {
  const response = await ky.post<ShareAPIResponse>("/api/post/share", {
    json: {
      id: id
    }
  })

  const data = await response.json()
  if ("error" in data) throw new Error(data.error)

  return data.message
}
