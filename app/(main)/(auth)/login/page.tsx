'use client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from 'react'
import { useToast } from "@/hooks/use-toast"
import useUserStore from "@/store/user"
import { FaDiscord, FaGithub, FaGoogle } from "react-icons/fa6"
import Link from "next/link"
import { useMutation } from "@tanstack/react-query"
import { loginFunction } from "@/features/auth/api/login"
import { FiLoader } from "react-icons/fi"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { toast } = useToast()
  const router = useRouter()
  const fetchUser = useUserStore(state => state.fetchUser)

  const { mutate: login, isPending } = useMutation({
    mutationKey: ['login'],
    mutationFn: () => loginFunction({ email, password }),
    onError(error) {
      toast({
        variant: 'destructive',
        title: "Error",
        description: error.message
      })
    },
    async onSuccess() {
      toast({
        title: "Success",
        description: "You Have Logged In"
      })

      await fetchUser();
      router.push('/')
    }
  })

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-sm shadow-lg relative z-10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-center">
            Sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
              />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
            </div>
            <Button
              type="button"
              onClick={() => login()}
              disabled={isPending}
              className="w-full font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
            >
              {isPending && <FiLoader />}
              Sign In
            </Button>
          </form>
          <div className="mt-6 text-center">
            <Link href="/forgot-password" className="text-primary mb-4 block text-sm text-center hover:underline">
              Forgot password?
            </Link>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="px-2 bg-background text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="mt-4 flex justify-center space-x-4">
              <Button variant='outline' size='lg'>
                <FaGithub size={50} />
              </Button>
              <Button variant='outline' size='lg'>
                <FaDiscord />
              </Button>
              <Button variant='outline' size='lg'>
                <FaGoogle />
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="text-center">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Register
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

