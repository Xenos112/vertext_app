export default function formatDate(date: Date | string): string {
  const inputDate = new Date(date);
  const now = new Date();
  const diffInMs = now.getTime() - inputDate.getTime();
  const diffInSecs = Math.floor(diffInMs / 1000);
  const diffInMins = Math.floor(diffInSecs / 60);
  const diffInHours = Math.floor(diffInMins / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays > 7) {
    return inputDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  if (diffInDays > 0) {
    return `${diffInDays}d ago`;
  }

  if (diffInHours > 0) {
    return `${diffInHours}h ago`;
  }

  if (diffInMins > 0) {
    return `${diffInMins}m ago`;
  }

  return "Just now";
}
