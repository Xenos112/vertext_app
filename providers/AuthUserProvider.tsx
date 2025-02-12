'use client'
import useUserStore from "@/store/user"
import { ReactNode, useEffect } from "react"
import { FiLoader } from "react-icons/fi"

export default function AuthUserProvider({ children }: { children: Readonly<ReactNode> }) {
  const fetchUser = useUserStore(state => state.fetchUser)
  const loading = useUserStore(state => state.loading)

  useEffect(() => {
    fetchUser()
  }, [])

  if (loading) {
    return <div className="h-screen flex items-center justify-center">
      <FiLoader className="animate-spin" size={20} />
    </div>
  }

  return <>{children}</>
}

