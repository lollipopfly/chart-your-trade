export interface DividendsState {
  list: Dividend[];
}

export interface FirebaseDividend {
  amount: string;
  comment: string;
  date: number | null;
  ticker: string;
}

export interface Dividend extends FirebaseDividend {
  id?: string;
}

export type CurrentDividend = Dividend | null;

export type FirebaseUnformatedDividend = [string, Dividend];

export type DividendsEvent = Date;
