export function formatDate(dateString: Date | number | string) {
  const date = new Date(dateString);

  const day = date.getUTCDate();
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getUTCFullYear();

  return `${day} ${month} ${year}`;
}
