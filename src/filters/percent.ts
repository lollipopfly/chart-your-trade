export default function currency(value: string) {
  if (!value) return "";

  value = value.toString();

  return value + "%";
}
