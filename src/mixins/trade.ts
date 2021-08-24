import Vue from "vue";
import { PieSeriesArr } from "@/types/charts";
import { Profit } from "@/types/portfolio";

export default Vue.extend({
  methods: {
    getProfit(
      buyPrice: string,
      sellPrice: string,
      quantity: string,
      fee: string
    ): Profit {
      const quantityNum: number = parseInt(quantity);
      let profit: Profit = parseFloat(sellPrice) - parseFloat(buyPrice);

      if (profit !== 0) {
        profit = profit * quantityNum;
        profit = profit - parseFloat(fee);
        profit = parseFloat(profit.toFixed(2));
      }

      return profit;
    },

    deleteLossTicker(arr: PieSeriesArr): PieSeriesArr {
      for (const key in arr) {
        if (arr[key].value <= 0) {
          delete arr[key];
        }
      }

      return arr;
    },
  },
});
