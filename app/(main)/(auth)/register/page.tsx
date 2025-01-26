"use client";
import { register } from "@/actions/register";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import useUserStore from "@/store/user";
import { redirect } from "next/navigation";
import { FormEvent, useState } from "react";

export default function page() {
  const fetchUser = useUserStore((state) => state.fetchUser);
  const [userData, setUserData] = useState({
    email: "",
    userName: "",
    password: "",
  });
  const { toast } = useToast();

  const registerHandler = async (e: FormEvent) => {
    e.preventDefault();
    if (!userData.email || !userData.userName || !userData.password) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Please fill all the fields.",
      });
      return;
    }
    const res = await register(userData);
    if (!res?.user?.id) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: res.message,
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      return;
    } else {
      toast({
        title: "Success",
        description: "User created successfully.",
      });
      await fetchUser();
      redirect("/");
    }
  };

  return (
    <div className=" h-screen grid place-items-center">
      <form className="space-y-4" onSubmit={registerHandler}>
        <Input
          type="email"
          placeholder="Email"
          value={userData.email}
          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
        />
        <Input
          type="text"
          placeholder="User Name"
          value={userData.userName}
          onChange={(e) =>
            setUserData({ ...userData, userName: e.target.value })
          }
        />
        <Input
          type="password"
          placeholder="Password"
          value={userData.password}
          onChange={(e) =>
            setUserData({ ...userData, password: e.target.value })
          }
        />
        <Button>Register</Button>
      </form>
    </div>
  );
}
