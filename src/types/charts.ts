export type Ticker = string;

// Pie chart
export interface PieSeries {
  name: string;
  value: number;
}

export interface PieSeriesObj {
  [key: string]: PieSeries;
}

// Line chart
export interface LineChartSerie {
  data: number[];
  name: string;
  showSymbol: boolean;
  smooth: boolean;
  type: string;
}

export interface LineChartTempTickerData {
  [key: string]: {
    amounts: string[];
    dates: string[];
  };
}
