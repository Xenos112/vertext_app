export function formatNumber(num: number): string {
  if (num < 1000) return num.toString();

  const units = ["", "K", "M", "B", "T"];
  let index = 0;
  while (num >= 1000) {
    num /= 1000;
    index++;
  }

  return `${num.toFixed(1)}${units[index]}`;
}
