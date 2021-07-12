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

<script>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart } from "echarts/charts";

import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from "echarts/components";
import VChart from "vue-echarts";

import messages from "@/components/utils/messages.js";
import tradeMixin from "@/mixins/trade.js";

use([
  CanvasRenderer,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
]);

export default {
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
        series: [],
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

    setAndGetxAxisData(data) {
      let timepstampsArr = this.getTimepstampsArr(data);
      let sortedDates = this.sortTimepstampsArr(timepstampsArr);
      sortedDates = this.convertTimestampsToDate(sortedDates);
      sortedDates = this.makeUniqArr(sortedDates);

      this.option.xAxis.data = sortedDates;

      return sortedDates;
    },

    setLegends(data) {
      let tickers = [];

      for (const key in data) {
        const element = data[key];

        tickers.push(element.ticker);
      }

      tickers = this.makeUniqArr(tickers);
      this.option.legend.data = tickers;
    },

    setSeries(data, axisData) {
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

    makeEmptyDataSeries(obj) {
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
          };

          arr.push(obj);
        }
      }

      return arr;
    },

    getTickersDateAndAmount(obj) {
      let datesAndAmounts = {};

      for (const key in obj) {
        const objItem = obj[key];
        const date = this.$options.filters.date(objItem.date);
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

    prepareSeries(axisDate, seriesArr, tickersDateAndAmountObj) {
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

    isArrayHasTicker(arr, ticker) {
      let isFound = false;

      for (var i = 0; i < arr.length; i++) {
        if (arr[i].name === ticker) {
          isFound = true;
          break;
        }
      }

      return isFound;
    },

    addAmountToSeries(ticker, amount, arr) {
      arr = arr.map((item) => {
        if (ticker === item.name) {
          item.data.push(amount);
        }

        return item;
      });

      return arr;
    },

    getPrevAmount(ticker, arr) {
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

    sortTimepstampsArr(arr) {
      const sortedDates = arr.sort((a, b) => {
        return a - b;
      });

      return sortedDates;
    },

    getTimepstampsArr(data) {
      let arr = [];

      for (const key in data) {
        const currentDividend = data[key];

        arr.push(currentDividend.date);
      }

      return arr;
    },

    convertTimestampsToDate(timestampArr) {
      for (const key in timestampArr) {
        let beautifiedDate = this.$options.filters.date(timestampArr[key]);
        timestampArr[key] = beautifiedDate;
      }

      return timestampArr;
    },

    makeUniqArr(arr) {
      return arr.filter((item, index) => arr.indexOf(item) === index);
    },
  },
};
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
