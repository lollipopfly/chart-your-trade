<template>
  <form @submit.prevent="handleSubmit">
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">{{ getModalActionText }} дивиденд</p>
      </header>
      <section class="modal-card-body">
        <div class="columns">
          <div class="column">
            <b-field label="Тикер:">
              <FormGroup :validator="$v.form.ticker">
                <b-autocomplete
                  v-model="form.ticker"
                  :data="filteredDividendTickers"
                  class="s-uppercase"
                  @select="(option) => (selected = option)"
                >
                </b-autocomplete>
              </FormGroup>
            </b-field>
          </div>

          <div class="column">
            <b-field label="Дата:">
              <FormGroup :validator="$v.date">
                <b-datepicker
                  v-model="date"
                  :append-to-body="true"
                  :first-day-of-week="1"
                  :events="dividendEvents"
                  icon="calendar-today"
                  :indicators="'dots'"
                >
                </b-datepicker>
              </FormGroup>
            </b-field>
          </div>
        </div>

        <div class="columns">
          <div class="column">
            <b-field label="Сумма">
              <FormGroup :validator="$v.form.amount">
                <b-input
                  type="text"
                  icon="currency-usd"
                  v-model.trim="form.amount"
                >
                </b-input>
              </FormGroup>
            </b-field>
          </div>
        </div>

        <div class="field">
          <label class="label">Комментарий</label>
          <div class="control">
            <textarea class="textarea" v-model.trim="form.comment"></textarea>
          </div>
        </div>
      </section>
      <footer class="modal-card-foot">
        <b-button
          native-type="submit"
          :disabled="isFormSubmit"
          :loading="isFormSubmit"
          class="button is-primary"
        >
          {{ getModalActionButtonText }}
        </b-button>
        <b-button label="Отмена" @click="$emit('close')" />
      </footer>
    </div>
  </form>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { decimal, required } from "vuelidate/lib/validators";
import { greaterThanZero } from "@/validations/validations.js";
import messages from "@/utils/messages.js";
import FormGroup from "@/components/partials/form/FormGroup.vue";

export default {
  name: "AddDividendModal",

  components: {
    FormGroup,
  },

  props: {
    type: String,
    dividendId: String,
    dividend: Object,
  },

  data() {
    return {
      date: new Date(),
      dividendEvents: [],
      isFormSubmit: false,
      form: {
        amount: null,
        comment: "",
        date: null,
        ticker: "",
      },
    };
  },

  watch: {
    "form.ticker": function(val) {
      this.form.ticker = val.toUpperCase();
    },
  },

  validations: {
    date: {
      required,
    },
    form: {
      ticker: {
        required,
      },
      amount: {
        decimal,
        greaterThanZero,
        required,
      },
    },
  },

  computed: {
    ...mapState({
      dividends: (state) => state.dividends.list,
    }),

    getModalActionText() {
      return messages.modal[this.type];
    },

    getModalActionButtonText() {
      return messages.modal.button[this.type];
    },

    filteredDividendTickers() {
      const tickersArr = this.getDividnedTickers();

      return tickersArr.filter((option) => {
        return option.toString().indexOf(this.form.ticker) >= 0;
      });
    },
  },

  mounted() {
    if (this.dividend && this.type === "update") {
      this.date = new Date(this.dividend.date);
      this.form = this.dividend;
    }

    this.setDividendEvents();
  },

  methods: {
    ...mapActions({
      addDividend: "dividends/ADD_DIVIDEND",
      updateDividend: "dividends/UPDATE_DIVIDEND",
    }),

    async handleSubmit() {
      // Validate
      this.$v.$touch();

      if (!this.$v.$invalid) {
        try {
          this.isFormSubmit = true;
          this.form.date = this.date.getTime();
          this.form.ticker = this.form.ticker.toUpperCase();

          if (this.type === "add") {
            await this.addDividend(this.form);
          } else if (this.type === "update") {
            const dividend = {
              id: this.dividendId,
              data: this.form,
            };

            await this.updateDividend(dividend);
          }

          // Notification
          this.$buefy.notification.open({
            message: messages.dividends[`success-${this.type}`],
            type: "is-success",
          });

          // Close modal
          this.$emit("close");

          setTimeout(() => {
            this.isFormSubmit = false;
          }, 500);
        } catch (error) {
          // Notification
          this.$buefy.notification.open({
            duration: 5000,
            message: messages.error["something-went-wrong"],
            type: "is-danger",
          });

          this.isFormSubmit = false;
        }
      }
    },

    getDividnedTickers() {
      const dividends = this.dividends;
      let arr = [];

      for (const key in dividends) {
        const dividend = dividends[key];
        const ticker = dividend.ticker;

        if (!arr.includes(ticker)) {
          arr.push(ticker);
        }
      }

      return arr;
    },

    setDividendEvents() {
      let eventsArr = Object.values(this.dividends).map((item) => {
        return new Date(item.date);
      });

      this.dividendEvents = eventsArr;
    },
  },
};
</script>
