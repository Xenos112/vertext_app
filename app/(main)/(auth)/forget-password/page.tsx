"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import forgetPasswordFunction from "@/features/auth/api/forget-password";
import { useToast } from "@/hooks/use-toast";
import { FiLoader } from "react-icons/fi";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  const { mutate: handleSubmit, isPending } = useMutation({
    mutationKey: ["forget-password"],
    mutationFn: () => forgetPasswordFunction({ email }),
    onError(error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
    onSuccess(data) {
      toast({
        title: "Success",
        description: data,
      });
      router.push("/forget-password/confirmation");
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-8 rounded-xl shadow-2xl">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold">Forgot Password</h2>
          <p className="mt-2 text-sm">
            Enter your email address and we&apos;ll send you a link to reset
            your password.
          </p>
        </div>
        <form className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm">
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-muted placeholder-gray-500 focus:outline-none focus:z-10 sm:text-sm"
            />
          </div>

          <Button
            type="button"
            onClick={() => handleSubmit()}
            disabled={isPending}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
          >
            {isPending && <FiLoader />}
            Send Email
          </Button>
        </form>
      </div>
    </div>
  );
}
