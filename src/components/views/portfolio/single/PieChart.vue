<template>
  <div>
    <div>
      <v-chart
        v-if="!isLoading && Object.keys(trades).length > 0"
        class="chart"
        :option="options"
      />
      <div v-else>
        <div v-if="!isLoading" class="has-text-centered">
          У вас еще нет сделок.
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
import { PieChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from "echarts/components";
import VChart from "vue-echarts";

use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
]);

export default {
  name: "",
  components: {
    VChart,
  },
  props: {
    trades: Object,
  },

  mounted() {
    this.beautifySeriesAndLegends(this.trades);
  },

  data() {
    return {
      isLoading: true,
      options: {
        title: {
          text: "Прибыль на акцию",
          left: "center",
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        legend: {
          orient: "vertical",
          left: "left",
          data: [],
        },
        series: [
          {
            name: "Прибыль на акцию",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: [],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      },
    };
  },

  methods: {
    beautifySeriesAndLegends(tradesList) {
      let tempArr = [];

      for (const key in tradesList) {
        const ticker = tradesList[key].ticker;
        const buyPrice = tradesList[key].buyPrice;
        const sellPrice = tradesList[key].sellPrice;
        const quantity = tradesList[key].quantity;
        const profit = this.getProfit(buyPrice, sellPrice, quantity);

        if (!tempArr[ticker]) {
          tempArr[ticker] = {
            name: ticker,
            value: profit,
          };
        } else {
          tempArr[ticker].value += profit;
        }

        tempArr[ticker].value = parseFloat(tempArr[ticker].value.toFixed(2));
      }

      this.options.legend.data = Object.keys(tempArr);
      this.options.series[0].data = Object.values(tempArr);
      this.isLoading = false;
    },

    // TODO: make mixin
    getProfit(buyPrice, sellPrice, quantity) {
      let profit = sellPrice - buyPrice;
      quantity = parseInt(quantity);
      profit = profit * quantity;
      profit = parseFloat(profit.toFixed(2));

      return profit;
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
