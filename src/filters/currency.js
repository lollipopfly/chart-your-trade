export default function currency(value) {
  if (!value) return "";

  const negativeIndex = value.indexOf("-");

  value = "$" + value.toString();

  // If number is negative
  if (negativeIndex !== -1) {
    value = value.replace("-", "");

    value = "-" + value;
  }

  return value;
}
