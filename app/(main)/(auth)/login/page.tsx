'use client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FormEvent, useState } from 'react'
import { z } from "zod"
import { useToast } from "@/hooks/use-toast"
import login from "@/actions/login"
import useUserStore from "@/store/user"
import { FaDiscord, FaGithub, FaGoogle } from "react-icons/fa6"
import Link from "next/link"
import { redirect } from "next/navigation"

const LoginValidator = z.object({
  email: z.string({ message: "Email Is Required" }).email({ message: "This is Not a Valid Email" }),
  password: z.string({ message: "Email Is Required" }).min(8, { message: "Password Must by at Least 8 Chars" })
})

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { toast } = useToast()
  const fetchUser = useUserStore(state => state.fetchUser)

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    const data = LoginValidator.safeParse({ email, password })
    if (!data.success) {
      data.error.errors.forEach(err => {
        toast({
          variant: 'destructive',
          title: "Error",
          description: err.message
        })
      })
      return
    }

    const loginResponse = await login({ password: data.data.password, email: data.data.email })
    if (loginResponse.error) {
      toast({
        variant: 'destructive',
        title: "Error",
        description: loginResponse.error
      })
    } else {
      toast({
        title: "Success",
        description: "You Have Logged In"
      })

      await fetchUser();
      redirect("/");
    }
  }

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
          <form onSubmit={handleLogin} className="space-y-4">
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
              type="submit"
              className="w-full font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
            >
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

