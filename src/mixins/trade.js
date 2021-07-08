export default {
  methods: {
    getProfit(buyPrice, sellPrice, quantity, fee) {
      let profit = sellPrice - buyPrice;

      quantity = parseInt(quantity);
      profit = profit * quantity;
      profit = profit - parseFloat(fee);
      profit = parseFloat(profit.toFixed(2));

      return profit;
    },

    deleteLossTicker(arr) {
      for (const key in arr) {
        if (arr[key].value <= 0) {
          delete arr[key];
        }
      }

      return arr;
    },
  },
};
