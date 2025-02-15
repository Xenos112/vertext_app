"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useMutation } from "@tanstack/react-query";
import { resetPasswordFunction } from "@/features/auth/api/forget-password";
import { useToast } from "@/hooks/use-toast";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { toast } = useToast();

  const { mutate: resetPassword, isPending } = useMutation({
    mutationKey: ["reset-password", id],
    mutationFn: () => resetPasswordFunction({ id, confirmPassword, password }),
    onSuccess() {
      toast({
        title: "Success",
        description: "You Password have Been reset",
      });
      router.push("/login");
    },
    onError(err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message,
      });
    },
  });

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="w-full">
          <CardHeader>
            <h1 className="mb-6 text-center text-3xl font-bold">
              Reset Your Password
            </h1>
            <CardTitle>Enter New Password</CardTitle>
          </CardHeader>
          <form>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                    <span className="sr-only">
                      {showPassword ? "Hide password" : "Show password"}
                    </span>
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                disabled={password !== confirmPassword || isPending}
                type="submit"
                className="w-full"
                onClick={() => resetPassword()}
              >
                Reset Password
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </main>
  );
}
