import Vue from "vue";

export default Vue.extend({
  methods: {
    getProfit(
      buyPrice: string,
      sellPrice: string,
      quantity: string,
      fee: string
    ): any {
      const quantityNum: number = parseInt(quantity);
      let profit: number = parseFloat(sellPrice) - parseFloat(buyPrice);

      if (profit !== 0) {
        profit = profit * quantityNum;
        profit = profit - parseFloat(fee);
        profit = parseFloat(profit.toFixed(2));
      }

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
