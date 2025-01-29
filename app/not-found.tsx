import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col gap-4 items-center justify-center h-screen">
      <h1 className="text-3xl font-bold">404 - Not Found</h1>
      <p>The Requested Page is Not Found</p>
      <Link href="/">
        <Button>Return to main page</Button>
      </Link>
    </div>
  );
}
