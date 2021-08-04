export default function date(value: string): string {
  if (!value) return "";

  const date = new Date(value);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();

  return day + "." + month + "." + year;
}
