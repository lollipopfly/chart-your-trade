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
import { State } from "@/types/state";
import { Trade, Profit } from "@/types/portfolio";
import { FirebaseDividend } from "@/types/dividends";
import { PieSeries, PieSeriesObj } from "@/types/charts";
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
    details: Array as () => Trade[],
    emptyChartText: String,
  },

  data() {
    return {
      isLoading: true as boolean,
      isShowChart: false as boolean,
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
      fee: (state) => (state as State).user.profile.brokerFeePercent,
    }),
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
      this.setSeriesAndLegends(this.details);
    },

    setSeriesAndLegends(list: Trade[]): void {
      let tempObj = this.prepareSeriesAndLegends(list);

      if (this.type === "trade") {
        tempObj = this.deleteLossTicker(tempObj);
      }

      if (Object.keys(tempObj).length > 0) {
        this.options.legend.data = Object.keys(tempObj);
        this.options.series[0].data = Object.values(tempObj);
        this.isShowChart = true;
      }

      this.isLoading = false;
    },

    prepareSeriesAndLegends(list: (Trade | FirebaseDividend)[]): PieSeriesObj {
      let obj: PieSeriesObj = {};

      list.forEach((item) => {
        const { ticker }: { ticker: string } = item;
        let profit: Profit = null;

        if (this.type === "trade") {
          const { buyPrice, sellPrice, quantity } = item as Trade;

          if (this.fee !== null) {
            profit = this.getProfit(buyPrice, sellPrice, quantity, this.fee);
          }
        } else {
          profit = parseFloat((item as FirebaseDividend).amount);
        }

        if (profit !== null) {
          if (!obj[ticker]) {
            obj[ticker] = {
              name: ticker,
              value: profit,
            };
          } else {
            obj[ticker].value += profit;
          }
        }

        obj[ticker].value = parseFloat(obj[ticker].value.toFixed(2));
      });

      return obj;
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
