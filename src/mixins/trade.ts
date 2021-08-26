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
      const buyPriceNumber: number = parseFloat(buyPrice);
      const sellPriceNumber: number = parseFloat(sellPrice);
      const feeNumber: number = parseFloat(fee) * 2;
      const feeAmount =
        (feeNumber * (buyPriceNumber + sellPriceNumber) * quantityNum) / 100;
      let profit: Profit = sellPriceNumber - buyPriceNumber;

      if (profit !== 0) {
        profit = profit * quantityNum;
        profit = profit - feeAmount;
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
