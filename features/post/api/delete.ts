import { type DeletePostAPIResponse } from '@/app/api'
import ky from 'ky'


export default async function deletePostAPI(id: string) {
  const res = await ky.post<DeletePostAPIResponse>('/api/post/delete', {
    method: 'DELETE',
    json: {
      id,
    },
  })

  const data = await res.json()

  if ("error" in data) {
    throw new Error(data.error)
  }

  return data.message
}
