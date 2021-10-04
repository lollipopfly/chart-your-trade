<template>
  <div class="container">
    <div class="columns">
      <div class="column is-10 is-offset-1 has-text-centered">
        <img alt="Vue logo" src="@/assets/images/logo.svg" class="v-logo" />
        <h1 class="page__title title">{{ pageTitle }}</h1>

        <div class="columns">
          <div class="column">
            <form autocomplete="off" class="columns is-mobile">
              <div class="is-10 column">
                <div
                  class="columns is-mobile is-vcentered has-text-left"
                  v-for="(field, index) in stocks"
                  :key="index"
                  :class="{ 'mb-5': index + 1 < stocks.length }"
                >
                  <div class="column is-5">
                    <div class="field">
                      <label class="label">Цена:</label>
                    </div>
                    <div class="control">
                      <input
                        type="number"
                        class="input"
                        v-model.number="field.price"
                        @input="getMiddleSellPrice"
                      />
                    </div>
                  </div>

                  <div class="column is-5">
                    <div class="field">
                      <label class="label">Кол-во:</label>
                      <input
                        type="number"
                        v-model.number="field.quantity"
                        class="input"
                        @input="getMiddleSellPrice"
                      />
                    </div>
                  </div>
                  <div class="column is-2">
                    <b-button
                      v-if="index > 0"
                      type="is-danger"
                      size="is-small"
                      icon-right="close"
                      @click="removeFieldGroup(field)"
                      class="sell__middle__remove__btn"
                    />
                  </div>
                </div>
              </div>

              <div class="column">
                <b-button
                  type="is-primary"
                  icon-left="plus"
                  @click="addFieldGroup"
                  class="button is-primary sell__middle__add__btn"
                />
              </div>
            </form>
          </div>

          <div class="column">
            <div
              class="message is-primary sell__middle__result"
              v-if="resultMiddlePrice"
            >
              <div class="message-body">
                Средняя цена продажи составит:
                <span class="form__result__item__price">{{
                  resultMiddlePrice | currency
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { MetaInfo } from "vue-meta";
import { Stock } from "@/types/instruments";

export default Vue.extend({
  name: "TheSellMiddlePrice",

  metaInfo(): MetaInfo {
    return {
      title: "Калькулятор усреднения продаж",
    };
  },

  props: {
    pageTitle: String,
  },

  data() {
    return {
      stocks: [
        {
          price: null,
          quantity: null,
        },
      ] as Stock[],
      resultMiddlePrice: "" as string,
    };
  },

  methods: {
    addFieldGroup(): void {
      this.stocks.push({
        price: null,
        quantity: null,
      });
    },

    removeFieldGroup(stockToRemove: Stock): void {
      this.stocks = this.stocks.filter((item) => item !== stockToRemove);

      // Calculate again
      this.getMiddleSellPrice();
    },

    getStockSum(): number {
      let priceSum: number = 0;

      this.stocks.forEach((stock: Stock) => {
        if (stock.quantity !== null && stock.price !== null) {
          priceSum += stock.quantity * stock.price;
        }
      });

      return priceSum;
    },

    getQuantitySum(): number {
      let quantitySum: number = 0;

      this.stocks.forEach((stock: Stock) => {
        if (stock.quantity !== null) {
          quantitySum += stock.quantity;
        }
      });

      return quantitySum;
    },

    // Calculate
    getMiddleSellPrice(): void {
      let allStockQuantity: number = this.getQuantitySum();
      let allStockSum: number = this.getStockSum();
      let stockDiff: number = allStockSum / allStockQuantity;

      if (!Number.isNaN(stockDiff)) {
        this.resultMiddlePrice = stockDiff.toFixed(2);
      } else {
        this.resultMiddlePrice = "";
      }
    },
  },
});
</script>

<style>
.group {
  width: 40%;
  padding: 0 15px;
  display: inline-block;
  vertical-align: bottom;
  text-align: left;
}
.group:last-child {
  width: 10%;
  vertical-align: middle;
}
.sell__middle__remove__btn {
  position: relative;
  top: 15px;
}
.sell__middle__add__btn {
  vertical-align: top;
  margin-top: 35px;
}
.sell__middle__result {
  margin-top: 12px;
}
</style>
