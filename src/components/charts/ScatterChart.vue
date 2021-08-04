<template>
  <div>
    <div>
      <v-chart
        v-if="!isLoading && Object.keys(data).length > 0"
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
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { ScatterChart } from "echarts/charts";
import { TooltipComponent } from "echarts/components";
import VChart from "vue-echarts";
import tradeMixin from "@/mixins/trade";
import messages from "@/utils/messages";

use([CanvasRenderer, ScatterChart, TooltipComponent]);

export default tradeMixin.extend({
  name: "ScatterChartt",

  components: {
    VChart,
  },

  props: {
    data: Object,
  },

  data() {
    return {
      isLoading: true,
      emptyChartText: messages.trade["no-trades"],
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
              const vm: any = new Vue();

              return vm.$options.filters.currency(val);
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
              const vm: any = new Vue();

              return vm.$options.filters.currency(val);
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
              color: (params: any): any => {
                let color = "#48c775";

                if (params.data[1] < 0) {
                  color = "#f14668";
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
          formatter: (params: any): any => {
            const vm: any = new Vue();
            const ticker = params.data[2];
            let profit = params.data[1];
            profit = vm.$options.filters.currency(profit);

            return `${ticker} - ${profit}`;
          },
        },
      },
    };
  },

  computed: {
    ...mapState({
      // For tradeMixin
      fee: (state: any) => state.user.profile.brokerFeePercent,
    }),
  },

  watch: {
    data: {
      handler() {
        this.initChart(this.data);
      },
    },
  },

  mounted() {
    this.initChart(this.data);
  },

  methods: {
    initChart(tradesList: any) {
      let tempArr = this.prepareSeries(tradesList);

      this.options.series[0].data = Object.values(tempArr);
      this.isLoading = false;
    },

    prepareSeries(tradesList: any) {
      let arr = [];

      for (const key in tradesList) {
        const ticker = tradesList[key].ticker;
        const buyPrice = tradesList[key].buyPrice;
        const sellPrice = tradesList[key].sellPrice;
        const quantity = tradesList[key].quantity;
        let profit = this.getProfit(buyPrice, sellPrice, quantity, this.fee);
        const volume = profit * quantity;

        arr.push([volume, profit, ticker]);
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
