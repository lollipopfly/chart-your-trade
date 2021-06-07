export default function currency(value) {
  if (!value) return "";

  value = value.toString();

  return value + "%";
}
