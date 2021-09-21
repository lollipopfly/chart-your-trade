<template>
  <div class="container">
    <div class="columns">
      <div class="column is-10 is-offset-1 has-text-centered">
        <img alt="Vue logo" src="@/assets/images/logo.svg" class="v-logo" />
        <h1 class="page__title title">{{ pageTitle }}</h1>

        <form action="" class="mb-6" @submit.prevent="onSubmit">
          <div class="mb-6 columns">
            <div class="column">
              <h3 class="middle__price__col__title title is-4">Мой портфель</h3>
              <div class="field has-text-left">
                <label for="middle-price" class="label"
                  >Средняя цена акции:</label
                >
                <div class="control">
                  <FormGroup :validator="$v.middlePrice">
                    <b-input
                      type="text"
                      id="middle-price"
                      icon="currency-usd"
                      v-model.trim="middlePrice"
                      autocomplete="off"
                    >
                    </b-input>
                  </FormGroup>
                </div>
              </div>

              <div class="field has-text-left">
                <label for="middle-stock-count" class="label">Кол-во:</label>
                <div class="control">
                  <FormGroup :validator="$v.middleStockCount">
                    <b-input
                      type="text"
                      id="middle-stock-count"
                      v-model.trim="middleStockCount"
                      autocomplete="off"
                    >
                    </b-input>
                  </FormGroup>
                </div>
              </div>
            </div>

            <div class="column">
              <h3 class="middle__price__col__title title is-4">Рынок</h3>

              <div class="field has-text-left">
                <label for="current-price" class="label"
                  >Текущая цена акции:</label
                >
                <div class="control">
                  <FormGroup :validator="$v.currentPrice">
                    <b-input
                      type="text"
                      id="current-price"
                      icon="currency-usd"
                      v-model.trim="currentPrice"
                      autocomplete="off"
                    >
                    </b-input>
                  </FormGroup>
                </div>
              </div>

              <div class="field has-text-left">
                <label for="stock-count" class="label">Кол-во:</label>
                <div class="control">
                  <FormGroup :validator="$v.stockCount">
                    <b-input
                      type="text"
                      id="stock-count"
                      v-model.trim="stockCount"
                      autocomplete="off"
                    >
                    </b-input>
                  </FormGroup>
                </div>
              </div>
            </div>
          </div>

          <div class="middle__price__form__bottom">
            <input type="submit" value="Рассчитать" class="button is-primary" />
          </div>
        </form>

        <!-- Result -->
        <transition name="fade">
          <div
            id="result"
            class="message is-primary"
            v-show="showResult && finalMiddlePrice"
          >
            <div class="message-body">
              <div class="is-size-5">
                Средняя цена составит:
                <span class="form__result__item__price"
                  >${{ finalMiddlePrice }}</span
                >
              </div>
              <div class="is-size-5">
                Необходимая сумма для усреднения:
                <span class="form__result__item__price"
                  >${{ finalMiddleSum }}</span
                >
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { MetaInfo } from "vue-meta";
import { decimal, required } from "vuelidate/lib/validators";
import FormGroup from "@/components/partials/form/FormGroup.vue";

export default Vue.extend({
  name: "MiddlePriceClaculator",

  metaInfo(): MetaInfo {
    return {
      title: "Калькулятор усреднения",
    };
  },

  components: {
    FormGroup,
  },

  props: {
    pageTitle: String,
  },

  validations: {
    middlePrice: {
      decimal,
      required,
    },
    middleStockCount: {
      required,
      decimal,
    },
    currentPrice: {
      required,
      decimal,
    },
    stockCount: {
      required,
      decimal,
    },
  },

  data() {
    return {
      middlePrice: "" as string,
      middleStockCount: "" as string,
      currentPrice: "" as string,
      stockCount: "" as string,
      finalMiddlePrice: "" as string,
      finalMiddleSum: "" as string,
      showResult: false as boolean,
    };
  },

  methods: {
    getMarketSum(): number {
      return parseFloat(this.currentPrice) * parseFloat(this.stockCount);
    },

    getPortfolioSum(): number {
      return parseFloat(this.middlePrice) * parseFloat(this.middleStockCount);
    },

    getAllStockCount(): number {
      return parseFloat(this.middleStockCount) + parseFloat(this.stockCount);
    },

    getMiddleSum(): number {
      return parseFloat(this.currentPrice) * parseFloat(this.stockCount);
    },

    getFormattedValue(value: number): string {
      return parseFloat(value.toFixed(2)).toString();
    },

    onSubmit() {
      // Validate
      this.$v.$touch();

      if (!this.$v.$invalid) {
        let tempMiddlePrice: number =
          (this.getPortfolioSum() + this.getMarketSum()) /
          this.getAllStockCount();

        this.finalMiddleSum = this.getFormattedValue(this.getMiddleSum());
        this.finalMiddlePrice = this.getFormattedValue(tempMiddlePrice);
        this.showResult = true;

        this.scrollToResult();
      }
    },

    scrollToResult() {
      setTimeout(() => {
        let element = document.querySelector("#result");

        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 0);
    },
  },
});
</script>

<style>
.title.middle__price__col__title {
  margin-bottom: 70px;
}
@media (max-width: 767px) {
  .title.middle__price__col__title {
    margin-bottom: 20px;
  }
}
.form__result__item__price {
  font-weight: 700;
}
</style>
