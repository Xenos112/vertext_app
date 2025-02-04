import prisma from '@/utils/prisma'
import { GitHub } from 'arctic'

const github = new GitHub(
  process.env.GITHUB_CLIENT_ID!,
  process.env.GITHUB_SECRET!,
  null,
)

interface GitHubUser {
  id: number
  login: string
  node_id: string
  avatar_url: string
  name: string
  email: string | null
}

export {
  github,
  type GitHubUser
}

async function createGithubUser({ avatar_url, email, id, login, name, node_id }: GitHubUser) {
  const user = await prisma.user.findUnique({
    where: {
      OR: [
        { github_id: id.toString() },
        { email: email as string }
      ]
    }
  })
}
