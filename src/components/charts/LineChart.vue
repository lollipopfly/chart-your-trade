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
    details: Array as () => Dividend[],
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
          data: [] as string[],
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
    details: {
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
      if (Object.keys(this.details).length > 0) {
        const axisData: string[] = this.setAndGetxAxisData(this.details);

        this.setLegends(this.details);
        this.setSeries(this.details, axisData);
        this.isShowChart = true;
      }

      this.isLoading = false;
    },

    setAndGetxAxisData(data: Dividend[]): string[] {
      let timepstampsArr: number[] = this.getTimepstampsArr(data);
      let sortedTimestampsArr: number[] = this.sortTimepstampsArr(
        timepstampsArr
      );
      let sortedDates: string[] = this.convertTimestampsToDate(
        sortedTimestampsArr
      );

      sortedDates = this.makeUniqStrArr(sortedDates);

      this.option.xAxis.data = sortedDates;

      return sortedDates;
    },

    setLegends(data: Dividend[]): void {
      let tickers: Ticker[] = data.map((item) => item.ticker);

      this.option.legend.data = this.makeUniqStrArr(tickers);
    },

    setSeries(data: Dividend[], axisData: string[]): void {
      let seriesArr: LineChartSerie[] = this.makeEmptyDataSeries(data);
      let tempTickersDateAndAmountObj: LineChartTempTickerData = this.getTickersDateAndAmount(
        data
      );

      axisData.map((item) => {
        seriesArr = this.prepareSeries(
          item,
          seriesArr,
          tempTickersDateAndAmountObj
        );
      });

      this.option.series = seriesArr;
    },

    makeEmptyDataSeries(dividendsArr: Dividend[]): LineChartSerie[] {
      let arr: LineChartSerie[] = [];

      dividendsArr.forEach((item) => {
        const { ticker } = item;
        const isArrayHasTicker = (element: LineChartSerie) =>
          element.name === ticker;

        if (!arr.some(isArrayHasTicker)) {
          let serieItem = {
            name: ticker,
            data: [],
            type: "line",
            smooth: true,
            showSymbol: false,
          } as LineChartSerie;

          arr.push(serieItem);
        }
      });

      return arr;
    },

    getTickersDateAndAmount(arr: Dividend[]): LineChartTempTickerData {
      const vm = new Vue();
      let datesAndAmounts: LineChartTempTickerData = {};

      arr.forEach((item) => {
        const { amount, ticker, date } = item;
        let amountDate = "";

        if (vm.$options.filters) {
          amountDate = vm.$options.filters.date(date);
        }

        if (!datesAndAmounts[ticker]) {
          datesAndAmounts[ticker] = {
            amounts: [amount],
            dates: [amountDate],
          };
        } else {
          datesAndAmounts[ticker].dates.push(amountDate);
          datesAndAmounts[ticker].amounts.push(amount);
        }
      });

      return datesAndAmounts;
    },

    prepareSeries(
      axisDate: string,
      seriesArr: LineChartSerie[],
      tickersDateAndAmountObj: LineChartTempTickerData
    ): LineChartSerie[] {
      for (const ticker in tickersDateAndAmountObj) {
        if (
          Object.prototype.hasOwnProperty.call(tickersDateAndAmountObj, ticker)
        ) {
          const item = tickersDateAndAmountObj[ticker];
          const index = item.dates.indexOf(axisDate);
          let amount = item.amounts[index];

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
      }

      return seriesArr;
    },

    addAmountToSeries(
      ticker: Ticker,
      amount: string,
      arr: LineChartSerie[]
    ): LineChartSerie[] {
      return arr.map((item: LineChartSerie) => {
        if (ticker === item.name) {
          item.data.push(parseFloat(amount));
        }

        return item;
      });
    },

    getPrevAmount(ticker: Ticker, arr: LineChartSerie[]): number {
      const prevObj: LineChartSerie | undefined = arr.find((item) => {
        if (ticker === item.name) {
          if (item.data && item.data.length > 0) {
            return true;
          }
        }
      });
      let prev: number = 0;

      if (prevObj !== undefined) {
        let prevAmountData = prevObj.data[prevObj.data.length - 1];

        if (typeof prevAmountData === "string") {
          prev = parseFloat(prevAmountData);
        } else if (typeof prevAmountData === "number") {
          prev = prevAmountData;
        }
      }

      return prev;
    },

    sortTimepstampsArr(arr: number[]): number[] {
      return arr.sort((a: number, b: number) => a - b);
    },

    getTimepstampsArr(data: Dividend[]): number[] {
      let arr: number[] = [];

      data.forEach((item) => {
        if (item.date !== null) {
          arr.push(item.date);
        }
      });

      return arr;
    },

    convertTimestampsToDate(timestampArr: number[]): string[] {
      const vm = new Vue();
      let arr: string[] = [];

      timestampArr.forEach((item, index) => {
        let beautifiedDate = "";

        if (vm.$options.filters) {
          beautifiedDate = vm.$options.filters.date(item);
        }

        arr[index] = beautifiedDate;
      });

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
