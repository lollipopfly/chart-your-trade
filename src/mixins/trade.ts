import Vue from "vue";

export default Vue.extend({
  methods: {
    getProfit(
      buyPrice: number,
      sellPrice: number,
      quantity: string,
      fee: string
    ): any {
      let profit = sellPrice - buyPrice;

      const quantityNum: number = parseInt(quantity);
      profit = profit * quantityNum;
      profit = profit - parseFloat(fee);
      profit = parseFloat(profit.toFixed(2));

      return profit;
    },

    deleteLossTicker(arr: any): any {
      for (const key in arr) {
        if (arr[key].value <= 0) {
          delete arr[key];
        }
      }

      return arr;
    },
  },
});
