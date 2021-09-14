<template>
  <div>
    <div>
      <v-chart
        v-if="!isLoading && Object.keys(details).length > 0"
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
import Vue from "vue";
import { mapState } from "vuex";
import VChart from "vue-echarts";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { ScatterChart } from "echarts/charts";
import { TooltipComponent } from "echarts/components";
import { State } from "@/types/state";
import { Trade, Profit } from "@/types/portfolio";
import { CallbackDataParams } from "node_modules/echarts/types/src/util/types.js";
import tradeMixin from "@/mixins/trade";
import messages from "@/utils/messages";

use([CanvasRenderer, ScatterChart, TooltipComponent]);

export default tradeMixin.extend({
  name: "ScatterChartt",

  components: {
    VChart,
  },

  props: {
    details: Array as () => Trade[],
  },

  data() {
    return {
      isLoading: true as boolean,
      emptyChartText: messages.trade["no-trades"] as string,
      options: {
        grid: {
          top: 100,
        },
        title: {
          text: "Карта сделок (профит-объем)",
          left: "center",
        },
        xAxis: {
          name: "Объем ($)",
          axisLabel: {
            formatter: (val: string): string => {
              const vm = new Vue();
              let str = "";

              if (vm.$options.filters) {
                str = vm.$options.filters.currency(val);
              }

              return str;
            },
          },
          nameTextStyle: {
            fontSize: 15,
            fontWeight: "700",
          },
        },
        yAxis: {
          name: "Профит ($)",
          axisLabel: {
            formatter: (val: string): string => {
              const vm = new Vue();
              let str = "";

              if (vm.$options.filters) {
                str = vm.$options.filters.currency(val);
              }

              return str;
            },
          },
          nameTextStyle: {
            fontSize: 15,
            fontWeight: "700",
          },
        },
        series: [
          {
            type: "scatter",
            data: [],
            symbolSize: 15,
            itemStyle: {
              color: (params: CallbackDataParams): string => {
                const data = params.data;
                let color = "#48c775";

                if (Array.isArray(data)) {
                  if (data[1] < 0) {
                    color = "#f14668";
                  }
                }

                return color;
              },
            },
          },
        ] as any,
        tooltip: {
          trigger: "item",
          axisPointer: {
            type: "cross",
          },
          formatter: (params: CallbackDataParams): string => {
            const vm = new Vue();
            const data = params.data;
            let ticker: string = "";
            let profit: Profit = null;

            if (Array.isArray(data)) {
              if (typeof data[2] === "string") {
                ticker = data[2];
              }

              if (typeof data[1] === "number") {
                profit = data[1];
              }
            }

            if (vm.$options.filters) {
              profit = vm.$options.filters.currency(profit);
            }

            return `${ticker} - ${profit}`;
          },
        },
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
        this.initChart(this.details);
      },
    },
  },

  mounted() {
    this.initChart(this.details);
  },

  methods: {
    initChart(tradesList: Trade[]): void {
      let tempArr: (number | string)[][] = this.prepareSeries(tradesList);

      this.options.series[0].data = Object.values(tempArr);
      this.isLoading = false;
    },

    prepareSeries(tradesList: Trade[]): (number | string)[][] | [] {
      let arr: (number | string)[][] = [];

      tradesList.forEach((item) => {
        const { ticker, buyPrice, sellPrice, quantity } = item;
        let profit: Profit = null;

        if (this.fee !== null) {
          profit = this.getProfit(buyPrice, sellPrice, quantity, this.fee);
        }

        if (profit !== null) {
          const volume = profit * parseFloat(quantity);

          arr.push([volume, profit, ticker]);
        }
      });

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
