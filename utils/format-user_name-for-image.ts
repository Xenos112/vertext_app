export function formatUserNameForImage(userName: string) {
  if (!userName) return ""
  return userName.slice(0, 2).toUpperCase();
}
