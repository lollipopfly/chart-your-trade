export default function currency(value) {
  if (!value) return "";

  value = value.toString();
  const negativeIndex = value.indexOf("-");

  value = "$" + value;

  // If number is negative
  if (negativeIndex !== -1) {
    value = value.replace("-", "");

    value = "-" + value;
  }

  return value;
}
