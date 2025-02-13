import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export default function ConfirmationPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-8 rounded-xl shadow-2xl text-center">
        <CheckCircle className="w-16 h-16 mx-auto" />
        <h2 className="mt-6 text-3xl font-bold">Check Your Email</h2>
        <p className="mt-2 text-sm">
          We&apos;ve sent a password reset link to your email address. Please check your inbox and follow the instructions to
          reset your password.
        </p>
        <Button asChild className="mt-8">
          <Link href="/">Return to Home</Link>
        </Button>
      </div>
    </div>
  )
}


