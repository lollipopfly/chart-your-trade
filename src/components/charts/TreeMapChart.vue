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
import Vue from "vue";
import { mapState } from "vuex";
import VChart from "vue-echarts";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { TreemapChart } from "echarts/charts";
import { TooltipComponent } from "echarts/components";
import { State } from "@/types/state";
import { Trade, Profit } from "@/types/portfolio";
import { PieSeries, PieSeriesObj } from "@/types/charts";
import { CallbackDataParams } from "node_modules/echarts/types/src/util/types.js";
import tradeMixin from "@/mixins/trade";
import messages from "@/utils/messages";

use([CanvasRenderer, TreemapChart, TooltipComponent]);

export default tradeMixin.extend({
  name: "TreemapChart",

  components: {
    VChart,
  },

  props: {
    details: Array as () => Trade[],
  },

  data() {
    return {
      isLoading: true as boolean,
      isShowChart: false as boolean,
      emptyChartText: messages.trade["no-profit-trades"] as string,
      options: {
        name: "Все",
        title: {
          text: "Прибыль на акцию",
          left: "center",
        },
        series: [
          {
            type: "treemap",
            roam: "move", // disable zoom
            label: {
              fontSize: 18,
              fontWeight: "500",
            },
            itemStyle: {
              borderColor: "#262931",
              borderWidth: 1,
            },
            data: [] as PieSeries[],
          },
        ],
      } as any,
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
      let tempObj: PieSeriesObj = this.prepareSeries(tradesList);
      tempObj = this.deleteLossTicker(tempObj);

      if (Object.keys(tempObj).length > 0) {
        this.setLabelFormatter();
        this.options.series[0].data = Object.values(tempObj);
        this.isShowChart = true;
      }

      this.isLoading = false;
    },

    prepareSeries(tradesList: Trade[]): PieSeriesObj {
      let obj: PieSeriesObj = {};

      tradesList.forEach((item: Trade) => {
        const { ticker, buyPrice, sellPrice, quantity } = item;
        let profit: Profit = null;

        if (this.fee !== null) {
          profit = this.getProfit(buyPrice, sellPrice, quantity, this.fee);
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

    setLabelFormatter() {
      const vm = new Vue();

      this.options.series[0].label.formatter = (
        params: CallbackDataParams
      ): string => {
        let labelStr: string = "";

        if (vm.$options.filters) {
          const formatedVal: string = vm.$options.filters.currency(
            params.value
          );
          labelStr = `${params.name} ${formatedVal}`;
        }

        return labelStr;
      };
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
