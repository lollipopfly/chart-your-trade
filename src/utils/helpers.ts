import {
  Dividend,
  FirebaseDividend,
  FirebaseUnformatedDividend,
} from "@/types/dividends";
import { FirebaseUnformatedTrade, Trade } from "@/types/portfolio";

export function prepareDividendsArray(obj: FirebaseDividend[]): Dividend[] {
  const tempArr = Object.entries(obj);

  return tempArr.map((item: FirebaseUnformatedDividend) => {
    const id = item[0];
    const val = item[1];
    val["id"] = id;

    return val;
  });
}

export function prepareTradesArray(obj: Trade[]): Trade[] {
  const tempArr = Object.entries(obj);

  return tempArr.map((item: FirebaseUnformatedTrade) => {
    const id: string = item[0];
    const val = item[1];
    val["id"] = id;

    return val;
  });
}
