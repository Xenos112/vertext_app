export default function sendToastEvent(data: {
  title: string;
  description?: string;
  variant?: "default" | "destructive";
}) {
  document.dispatchEvent(
    new CustomEvent("toast", {
      detail: {
        title: data.title,
        description: data.description,
        variant: data.variant || "default",
      },
    }),
  );
}
