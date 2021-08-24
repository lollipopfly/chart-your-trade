export type Ticker = string;

// Pie chart
export interface PieSeries {
  name: string;
  value: number;
}

export interface PieSeriesArr {
  [key: string]: PieSeries;
}

// Scatter chart
export type ScatterChartSeries = (number | string)[];

// Line chart
export type LineChartxAxisDate = string;

export type LineChartTimestamp = number;

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
    dates: LineChartxAxisDate[];
  };
}
