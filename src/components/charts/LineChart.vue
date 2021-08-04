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
    data: Object,
  },

  data() {
    return {
      isLoading: true,
      isShowChart: false,
      emptyChartText: messages.dividends["no-dividends"],
      option: {
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: [],
        },
        xAxis: {
          type: "category",
          data: [],
          boundaryGap: false,
        },
        yAxis: {
          type: "value",
        },
        series: [] as any,
      },
    };
  },

  watch: {
    data: {
      handler() {
        this.initChart();
      },
    },
  },

  mounted() {
    this.initChart();
  },

  methods: {
    initChart() {
      if (Object.keys(this.data).length > 0) {
        const axisData = this.setAndGetxAxisData(this.data);

        this.setLegends(this.data);
        this.setSeries(this.data, axisData);
        this.isShowChart = true;
      }

      this.isLoading = false;
    },

    setAndGetxAxisData(data: any) {
      let timepstampsArr = this.getTimepstampsArr(data);
      let sortedDates = this.sortTimepstampsArr(timepstampsArr);
      sortedDates = this.convertTimestampsToDate(sortedDates);
      sortedDates = this.makeUniqArr(sortedDates);

      this.option.xAxis.data = sortedDates;

      return sortedDates;
    },

    setLegends(data: any) {
      let tickers = [];

      for (const key in data) {
        const element = data[key];

        tickers.push(element.ticker);
      }

      tickers = this.makeUniqArr(tickers);
      this.option.legend.data = tickers;
    },

    setSeries(data: any, axisData: any) {
      let seriesArr = this.makeEmptyDataSeries(data);
      let tempTickersDateAndAmountObj = this.getTickersDateAndAmount(data);

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

    makeEmptyDataSeries(obj: any) {
      let arr = [];

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
          };

          arr.push(obj);
        }
      }

      return arr;
    },

    getTickersDateAndAmount(obj: any) {
      // TODO: change this type
      let datesAndAmounts: { [key: string]: any } = {};

      for (const key in obj) {
        const vm: any = new Vue();
        const objItem = obj[key];
        const date = vm.$options.filters.date(objItem.date);
        const amount = objItem.amount;

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
      axisDate: string,
      seriesArr: any,
      tickersDateAndAmountObj: any
    ) {
      for (const ticker in tickersDateAndAmountObj) {
        const tickerData = tickersDateAndAmountObj[ticker];
        const index = tickerData.dates.indexOf(axisDate);
        let amount = tickerData.amounts[index];

        // Если дата найдена
        if (index !== -1) {
          seriesArr = this.addAmountToSeries(ticker, amount, seriesArr);
        } else {
          // Если дата не найдена
          amount = this.getPrevAmount(ticker, seriesArr);
          seriesArr = this.addAmountToSeries(ticker, amount, seriesArr);
        }
      }

      return seriesArr;
    },

    isArrayHasTicker(arr: any, ticker: string) {
      let isFound = false;

      for (var i = 0; i < arr.length; i++) {
        if (arr[i].name === ticker) {
          isFound = true;
          break;
        }
      }

      return isFound;
    },

    addAmountToSeries(ticker: string, amount: string, arr: any) {
      arr = arr.map((item: any) => {
        if (ticker === item.name) {
          item.data.push(amount);
        }

        return item;
      });

      return arr;
    },

    getPrevAmount(ticker: string, arr: any) {
      for (let i = 0; i < arr.length; i++) {
        const element = arr[i];

        if (ticker === element.name) {
          let prevAmount = element.data[element.data.length - 1];

          if (prevAmount === undefined) {
            prevAmount = 0;
          }

          return prevAmount;
        }
      }
    },

    sortTimepstampsArr(arr: any) {
      const sortedDates = arr.sort((a: number, b: number) => {
        return a - b;
      });

      return sortedDates;
    },

    getTimepstampsArr(data: any) {
      let arr = [];

      for (const key in data) {
        const currentDividend = data[key];

        arr.push(currentDividend.date);
      }

      return arr;
    },

    convertTimestampsToDate(timestampArr: any) {
      for (const key in timestampArr) {
        const vm: any = new Vue();
        let beautifiedDate = vm.$options.filters.date(timestampArr[key]);
        timestampArr[key] = beautifiedDate;
      }

      return timestampArr;
    },

    makeUniqArr(arr: any) {
      return arr.filter(
        (item: any, index: number) => arr.indexOf(item) === index
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
