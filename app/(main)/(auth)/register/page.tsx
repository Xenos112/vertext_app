"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import useUserStore from "@/store/user";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { FaDiscord, FaGithub, FaGoogle } from "react-icons/fa6";
import { FiLoader } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { UserRegisterData } from "@/db/services/validators/user.validator";
import UserClientService from "@/db/services/client/user.service";
import sendToastEvent from "@/utils/sendToastEvent";

const useRegister = (userData: UserRegisterData) => {
  const router = useRouter();
  const fetchUser = useUserStore((state) => state.fetchUser);

  const { isPending, mutate: register } = useMutation({
    mutationKey: ["register"],
    mutationFn: () => UserClientService.register(userData),
    onError(error) {
      sendToastEvent({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
    async onSuccess() {
      sendToastEvent({
        title: "Success",
        description: "You have successfully registered",
      });

      await fetchUser();
      router.push("/");
    },
  });

  return { isPending, register };
};

export default function RegisterPage() {
  const [userData, setUserData] = useState({
    email: "",
    user_name: "",
    password: "",
  });

  const { isPending, register } = useRegister(userData);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center">
            Create an account
          </CardTitle>
          <CardDescription className="text-center">
            Enter your details to register
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="Email"
                required
              />
              <Input
                type="text"
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    user_name: e.target.value,
                  }))
                }
                placeholder="Username"
                required
              />
              <Input
                type="password"
                placeholder="Password"
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, password: e.target.value }))
                }
                required
              />
            </div>
            <Button
              type="button"
              onClick={() => register()}
              disabled={isPending}
              className="w-full"
            >
              {isPending && <FiLoader />}
              Register
            </Button>
          </form>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <div className="flex justify-center space-x-4">
            <Button variant="outline" size="lg">
              <FaGithub size={50} />
            </Button>
            <Button variant="outline" size="lg">
              <FaDiscord />
            </Button>
            <Button variant="outline" size="lg">
              <FaGoogle />
            </Button>
          </div>
        </CardContent>
        <CardFooter className="text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
