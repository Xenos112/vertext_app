import ky from 'ky'
import { type GetPostAPIResponse } from '@/app/api'

export default async function getPostById(id: string) {
  const res = await ky.get<GetPostAPIResponse>(`/api/post/${id}`, {
    throwHttpErrors: false,
  })

  const data = await res.json()

  if ("error" in data) throw new Error(data.error)

  console.log(data.post)
  return data.post
}
