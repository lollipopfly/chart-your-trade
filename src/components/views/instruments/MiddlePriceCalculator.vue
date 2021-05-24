<template>
  <div class="container">
    <div class="columns">
      <div class="column is-10 is-offset-1 has-text-centered">
        <img alt="Vue logo" src="@/assets/images/v-logo.png" class="v-logo" />
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
                      v-model.number="middlePrice"
                      :class="{ 'is-danger': $v.middlePrice.$error }"
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
                      v-model.number="middleStockCount"
                      :class="{ 'is-danger': $v.middleStockCount.$error }"
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
                      v-model.number="currentPrice"
                      :class="{ 'is-danger': $v.currentPrice.$error }"
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
                      v-model.number="stockCount"
                      :class="{ 'is-danger': $v.stockCount.$error }"
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
import { decimal, required } from "vuelidate/lib/validators";
import FormGroup from "@/components/partials/form/FormGroup.vue";

export default {
  name: "MiddlePriceClaculator",
  metaInfo: {
    title: "Калькулятор усреднения",
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
@media (max-width: 767px) {
  .title.middle__price__col__title {
    margin-bottom: 20px;
  }
}
.form__result__item__price {
  font-weight: 700;
}
</style>
