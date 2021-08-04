<template>
  <div>
    <div>
      <v-chart
        v-if="!isLoading && isShowChart"
        class="chart"
        :option="options"
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
import { mapState } from "vuex";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from "echarts/components";
import VChart from "vue-echarts";
import { PieSeries } from "@/types/charts";
import tradeMixin from "@/mixins/trade";

use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
]);

export default tradeMixin.extend({
  name: "PieChart",

  components: {
    VChart,
  },

  props: {
    type: String,
    data: Object,
    emptyChartText: String,
  },

  data() {
    return {
      isLoading: true,
      isShowChart: false,
      options: {
        title: {
          text: "Прибыль на акцию",
          left: "center",
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : ${c} ({d}%)",
        },
        legend: {
          orient: "vertical",
          left: "left",
          data: [] as string[],
        },
        series: [
          {
            name: "Прибыль на акцию",
            type: "pie",
            radius: "50%",
            center: ["50%", "60%"],
            data: [] as PieSeries[],
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

  computed: {
    ...mapState({
      fee: (state: any) => state.user.profile.brokerFeePercent,
    }),
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
      this.setSeriesAndLegends(this.data);
    },

    setSeriesAndLegends(list: any) {
      let tempArr = this.prepareSeriesAndLegends(list);

      if (this.type === "trade") {
        tempArr = this.deleteLossTicker(tempArr);
      }

      if (Object.keys(tempArr).length > 0) {
        this.options.legend.data = Object.keys(tempArr);
        this.options.series[0].data = Object.values(tempArr);
        this.isShowChart = true;
      }

      this.isLoading = false;
    },

    prepareSeriesAndLegends(list: any) {
      let arr = [];

      for (const key in list) {
        const ticker = list[key].ticker;
        let profit = null;

        if (this.type === "trade") {
          const buyPrice = list[key].buyPrice;
          const sellPrice = list[key].sellPrice;
          const quantity = list[key].quantity;
          profit = this.getProfit(buyPrice, sellPrice, quantity, this.fee);
        } else {
          // If dividend
          profit = parseFloat(list[key].amount);
        }

        if (!arr[ticker]) {
          arr[ticker] = {
            name: ticker,
            value: profit,
          };
        } else {
          arr[ticker].value += profit;
        }

        arr[ticker].value = parseFloat(arr[ticker].value.toFixed(2));
      }

      return arr;
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
