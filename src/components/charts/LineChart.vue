<template>
  <div>
    <div>
      <v-chart
        v-if="!isLoading && isShowChart"
        class="chart"
        :option="option"
      />
      <div v-else>
        <div v-if="!isLoading" class="has-text-centered">
          {{ emptyChartText }}
        </div>
      </div>
    </div>

    <b-loading
      class="chart__loading"
      :is-full-page="false"
      v-model="isLoading"
    ></b-loading>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart } from "echarts/charts";
import {
  Ticker,
  LineChartxAxisDate,
  LineChartTimestamp,
  LineChartSerie,
  LineChartTempTickerData,
} from "@/types/charts";
import { Dividend } from "@/types/dividends";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from "echarts/components";
import VChart from "vue-echarts";

import messages from "@/utils/messages";
import tradeMixin from "@/mixins/trade";

use([
  CanvasRenderer,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
]);

export default Vue.extend({
  name: "LineChart",

  components: {
    VChart,
  },

  mixins: [tradeMixin],

  props: {
    type: String,
    data: Array as () => Dividend[],
  },

  data() {
    return {
      isLoading: true as boolean,
      isShowChart: false as boolean,
      emptyChartText: messages.dividends["no-dividends"] as string,
      option: {
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: [] as LineChartxAxisDate[],
        },
        xAxis: {
          type: "category",
          data: [] as string[],
          boundaryGap: false,
        },
        yAxis: {
          type: "value",
        },
        series: [] as LineChartSerie[],
      },
    };
  },

  watch: {
    data: {
      handler(): void {
        this.initChart();
      },
    },
  },

  mounted() {
    this.initChart();
  },

  methods: {
    initChart(): void {
      if (Object.keys(this.data).length > 0) {
        const axisData: LineChartxAxisDate[] = this.setAndGetxAxisData(
          this.data
        );

        this.setLegends(this.data);
        this.setSeries(this.data, axisData);
        this.isShowChart = true;
      }

      this.isLoading = false;
    },

    setAndGetxAxisData(data: Dividend[]): LineChartxAxisDate[] {
      let timepstampsArr: LineChartTimestamp[] = this.getTimepstampsArr(data);
      let sortedTimestampsArr: LineChartTimestamp[] = this.sortTimepstampsArr(
        timepstampsArr
      );
      let sortedDates: LineChartxAxisDate[] = this.convertTimestampsToDate(
        sortedTimestampsArr
      );

      sortedDates = this.makeUniqStrArr(sortedDates);

      this.option.xAxis.data = sortedDates;

      return sortedDates;
    },

    setLegends(data: Dividend[]): void {
      let tickers: Ticker[] = [];

      for (const key in data) {
        const element = data[key];

        tickers.push(element.ticker);
      }

      tickers = this.makeUniqStrArr(tickers);

      this.option.legend.data = tickers;
    },

    setSeries(data: Dividend[], axisData: LineChartxAxisDate[]): void {
      let seriesArr: LineChartSerie[] = this.makeEmptyDataSeries(data);
      let tempTickersDateAndAmountObj: LineChartTempTickerData = this.getTickersDateAndAmount(
        data
      );

      for (const axisKey in axisData) {
        const axisDate = axisData[axisKey];

        seriesArr = this.prepareSeries(
          axisDate,
          seriesArr,
          tempTickersDateAndAmountObj
        );
      }

      this.option.series = seriesArr;
    },

    makeEmptyDataSeries(obj: Dividend[]): LineChartSerie[] {
      let arr: LineChartSerie[] = [];

      for (const key in obj) {
        const element = obj[key];
        const ticker = element.ticker;

        if (!this.isArrayHasTicker(arr, ticker)) {
          let obj = {
            name: ticker,
            data: [],
            type: "line",
            smooth: true,
            showSymbol: false,
          } as LineChartSerie;

          arr.push(obj);
        }
      }

      return arr;
    },

    getTickersDateAndAmount(obj: Dividend[]): LineChartTempTickerData {
      let datesAndAmounts: LineChartTempTickerData = {};

      for (const key in obj) {
        const vm = new Vue();
        const objItem = obj[key];
        const amount = objItem.amount;
        let date = "";

        if (vm.$options.filters) {
          date = vm.$options.filters.date(objItem.date);
        }

        if (!datesAndAmounts[objItem.ticker]) {
          datesAndAmounts[objItem.ticker] = {
            amounts: [amount],
            dates: [date],
          };
        } else {
          datesAndAmounts[objItem.ticker].dates.push(date);
          datesAndAmounts[objItem.ticker].amounts.push(amount);
        }
      }

      return datesAndAmounts;
    },

    prepareSeries(
      axisDate: LineChartxAxisDate,
      seriesArr: LineChartSerie[],
      tickersDateAndAmountObj: LineChartTempTickerData
    ): LineChartSerie[] {
      for (const ticker in tickersDateAndAmountObj) {
        const tickerData = tickersDateAndAmountObj[ticker];
        const index = tickerData.dates.indexOf(axisDate);
        let amount = tickerData.amounts[index];

        // Если дата найдена
        if (index !== -1) {
          seriesArr = this.addAmountToSeries(ticker, amount, seriesArr);
        } else {
          // Если дата не найдена
          let prevAmount = this.getPrevAmount(ticker, seriesArr);

          if (prevAmount !== undefined) {
            amount = prevAmount.toString();
            seriesArr = this.addAmountToSeries(ticker, amount, seriesArr);
          }
        }
      }

      return seriesArr;
    },

    isArrayHasTicker(arr: LineChartSerie[], ticker: string): boolean {
      let isFound = false;

      for (var i = 0; i < arr.length; i++) {
        if (arr[i].name === ticker) {
          isFound = true;

          break;
        }
      }

      return isFound;
    },

    addAmountToSeries(
      ticker: Ticker,
      amount: string,
      arr: LineChartSerie[]
    ): LineChartSerie[] {
      arr = arr.map((item: LineChartSerie) => {
        if (ticker === item.name) {
          item.data.push(parseFloat(amount));
        }

        return item;
      });

      return arr;
    },

    getPrevAmount(ticker: Ticker, arr: LineChartSerie[]): number {
      for (let i = 0; i < arr.length; i++) {
        const element = arr[i];

        if (ticker === element.name) {
          let prevAmount: null | number = null;

          if (element.data && element.data.length > 0) {
            let prevAmountData = element.data[element.data.length - 1];

            if (typeof prevAmountData === "string") {
              prevAmount = parseFloat(prevAmountData);
            } else if (typeof prevAmountData === "number") {
              prevAmount = prevAmountData;
            }
          }

          if (prevAmount === null) {
            prevAmount = 0;
          }

          if (prevAmount !== undefined) {
            return prevAmount;
          }
        }
      }

      return 0;
    },

    sortTimepstampsArr(arr: LineChartTimestamp[]): LineChartTimestamp[] {
      const sortedDates: LineChartTimestamp[] = arr.sort(
        (a: number, b: number) => {
          return a - b;
        }
      );

      return sortedDates;
    },

    getTimepstampsArr(data: Dividend[]): LineChartTimestamp[] {
      let arr: LineChartTimestamp[] = [];

      for (const key in data) {
        const currentDividend = data[key];

        if (currentDividend.date !== null) {
          arr.push(currentDividend.date);
        }
      }

      return arr;
    },

    convertTimestampsToDate(
      timestampArr: LineChartTimestamp[]
    ): LineChartxAxisDate[] {
      let arr: LineChartxAxisDate[] = [];

      for (const key in timestampArr) {
        const vm = new Vue();
        let beautifiedDate = "";

        if (vm.$options.filters) {
          beautifiedDate = vm.$options.filters.date(timestampArr[key]);
        }

        arr[key] = beautifiedDate;
      }

      return arr;
    },

    makeUniqStrArr(arr: string[]): string[] {
      return arr.filter(
        (item: string, index: number) => arr.indexOf(item) === index
      );
    },
  },
});
</script>

<style>
.chart {
  width: 100%;
  height: 600px;
}
.chart__loading {
  padding-top: 30px;
  padding-bottom: 30px;
}
</style>
