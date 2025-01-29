export default function copyText(text: string) {
  try {
    navigator.clipboard.writeText(text);
    return { message: "done" };
  } catch (error) {
    return { error };
  }
}
