export default {
  methods: {
    getProfit(buyPrice, sellPrice, quantity) {
      let profit = sellPrice - buyPrice;
      quantity = parseInt(quantity);
      profit = profit * quantity;
      profit = parseFloat(profit.toFixed(2));

      return profit;
    },
  },
};
