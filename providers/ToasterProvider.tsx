"use client";

import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

export type EventDetail = {
  title?: string;
  description: string;
  variant?: "default" | "destructive";
};
export default function ToasterProvider() {
  const { toast } = useToast();

  useEffect(() => {
    const handleToast = (event: CustomEvent<EventDetail>) => {
      toast(event.detail);
    };

    document.addEventListener("toast", handleToast as EventListener);
  }, [toast]);

  return <div></div>;
}
