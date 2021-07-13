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
          {{ noTradesText }}
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
import { mapState } from "vuex";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { TreemapChart } from "echarts/charts";
import { TooltipComponent } from "echarts/components";
import VChart from "vue-echarts";
import tradeMixin from "@/mixins/trade.js";
import messages from "@/components/utils/messages.js";

use([CanvasRenderer, TreemapChart, TooltipComponent]);

export default {
  name: "TreemapChart",

  components: {
    VChart,
  },
  mixins: [tradeMixin],

  props: {
    trades: Object,
  },

  data() {
    return {
      isLoading: true,
      isShowChart: false,
      noTradesText: messages.trade["no-profit-trades"],
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
            data: [],
          },
        ],
      },
    };
  },

  computed: {
    ...mapState({
      fee: (state) => state.user.profile.brokerFeePercent,
    }),
  },

  watch: {
    trades: {
      handler() {
        this.initChart(this.trades);
      },
    },
  },

  mounted() {
    this.initChart(this.trades);
  },

  methods: {
    initChart(tradesList) {
      let tempArr = this.prepareSeries(tradesList);
      tempArr = this.deleteLossTicker(tempArr);

      if (Object.keys(tempArr).length > 0) {
        this.setLabelFormatter();
        this.options.series[0].data = Object.values(tempArr);
        this.isShowChart = true;
      }

      this.isLoading = false;
    },

    prepareSeries(tradesList) {
      let arr = [];

      for (const key in tradesList) {
        const ticker = tradesList[key].ticker;
        const buyPrice = tradesList[key].buyPrice;
        const sellPrice = tradesList[key].sellPrice;
        const quantity = tradesList[key].quantity;
        let profit = this.getProfit(buyPrice, sellPrice, quantity, this.fee);

        if (!arr[ticker]) {
          arr[ticker] = {
            name: `${ticker}`,
            value: profit,
          };
        } else {
          arr[ticker].value += profit;
        }

        arr[ticker].value = parseFloat(arr[ticker].value.toFixed(2));
      }

      return arr;
    },

    setLabelFormatter() {
      this.options.series[0].label.formatter = (params) => {
        const formatedVal = this.$options.filters.currency(params.value);
        const labelStr = `${params.name} ${formatedVal}`;

        return labelStr;
      };
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
