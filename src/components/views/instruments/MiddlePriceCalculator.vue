<template>
  <div class="container">
    <div class="columns">
      <div class="column is-10 is-offset-1 has-text-centered">
        <img alt="Vue logo" src="@/assets/images/v-logo.png" class="v-logo" />
        <h1 class="page__title title">{{ pageTitle }}</h1>

        <form
          action=""
          class="mb-6"
          autocomplete="off"
          @submit.prevent="onSubmit"
        >
          <div class="mb-6 columns">
            <div class="column">
              <h3 class="middle__price__col__title title is-4">Мой портфель</h3>
              <div class="field has-text-left">
                <label for="middle-price" class="label"
                  >Средняя цена акции:</label
                >
                <div class="control">
                  <FormGroup :validator="$v.middlePrice">
                    <input
                      type="text"
                      v-model.number="middlePrice"
                      name="middle-price"
                      id="middle-price"
                      class="input"
                      :class="{ 'is-danger': $v.middlePrice.$error }"
                    />
                  </FormGroup>
                </div>
              </div>

              <div class="field has-text-left">
                <label for="middle-stock-count" class="label">Кол-во:</label>
                <div class="control">
                  <FormGroup :validator="$v.middlePrice">
                    <input
                      type="text"
                      v-model.number="middleStockCount"
                      id="middle-stock-count"
                      name="middle-stock-count"
                      class="input"
                      :class="{ 'is-danger': $v.middleStockCount.$error }"
                    />
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
                  <FormGroup :validator="$v.middlePrice">
                    <input
                      type="text"
                      v-model.number="currentPrice"
                      id="current-price"
                      name="current-price"
                      class="input"
                      :class="{ 'is-danger': $v.currentPrice.$error }"
                    />
                  </FormGroup>
                </div>
              </div>

              <div class="field has-text-left">
                <label for="stock-count" class="label">Кол-во:</label>
                <div class="control">
                  <FormGroup :validator="$v.middlePrice">
                    <input
                      type="text"
                      v-model.number="stockCount"
                      id="stock-count"
                      name="stock-count"
                      class="input"
                      :class="{ 'is-danger': $v.stockCount.$error }"
                    />
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
            class="message is-primary"
            v-if="this.showResult && this.finalMiddlePrice"
          >
            <div class="message-body">
              <div class="is-size-5">
                Средняя цена составит:
                <span class="form__result__item__price"
                  >${{ this.finalMiddlePrice }}</span
                >
              </div>
              <div class="is-size-5">
                Необходимая сумма для усреднения:
                <span class="form__result__item__price"
                  >${{ this.finalMiddleSum }}</span
                >
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import { numeric, required } from "vuelidate/lib/validators";
import FormGroup from "@/components/partials/form/FormGroup.vue";

export default {
  name: "MiddlePriceClaculator",
  components: {
    FormGroup,
  },
  props: {
    pageTitle: String,
  },

  validations: {
    middlePrice: {
      numeric,
      required,
    },
    middleStockCount: {
      required,
      numeric,
    },
    currentPrice: {
      required,
      numeric,
    },
    stockCount: {
      required,
      numeric,
    },
  },

  data() {
    return {
      middlePrice: null,
      middleStockCount: null,
      currentPrice: null,
      stockCount: null,
      finalMiddlePrice: null,
      finalMiddleSum: null,
      showResult: false,
    };
  },

  methods: {
    getMarketSum() {
      return this.currentPrice * this.stockCount;
    },

    getPortfolioSum() {
      return this.middlePrice * this.middleStockCount;
    },

    getAllStockCount() {
      return this.middleStockCount + this.stockCount;
    },

    getMiddleSum() {
      return this.currentPrice * this.stockCount;
    },

    getFormattedValue(value) {
      return parseFloat(value.toFixed(2));
    },

    onSubmit() {
      // Validate
      this.$v.$touch();

      if (!this.$v.$invalid) {
        let tempMiddlePrice =
          (this.getPortfolioSum() + this.getMarketSum()) /
          this.getAllStockCount();

        this.finalMiddleSum = this.getFormattedValue(this.getMiddleSum());
        this.finalMiddlePrice = this.getFormattedValue(tempMiddlePrice);
        this.showResult = true;
      }
    },
  },
};
</script>

<style>
.title.middle__price__col__title {
  margin-bottom: 70px;
}
.form__result__item__price {
  font-weight: 700;
}
</style>
