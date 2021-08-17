<template>
  <form @submit.prevent="handleSubmit">
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">{{ getModalActionText }} сделку</p>
      </header>
      <section class="modal-card-body">
        <div class="columns">
          <div class="column">
            <b-field label="Тикер:">
              <FormGroup :validator="$v.form.ticker">
                <b-input
                  type="text"
                  ref="ticker"
                  v-model.trim="form.ticker"
                  class="is-uppercase	"
                ></b-input>
              </FormGroup>
            </b-field>
          </div>

          <div class="column">
            <b-field label="Кол-во:">
              <FormGroup :validator="$v.form.quantity">
                <b-input type="text" v-model.trim="form.quantity"> </b-input>
              </FormGroup>
            </b-field>
          </div>
        </div>

        <div class="columns">
          <div class="column">
            <b-field label="Дата откр.:">
              <FormGroup :validator="$v.openDate">
                <b-datepicker
                  v-model="openDate"
                  :append-to-body="true"
                  :first-day-of-week="1"
                  icon="calendar-today"
                >
                </b-datepicker>
              </FormGroup>
            </b-field>
          </div>

          <div class="column">
            <b-field label="Дата закр.:">
              <FormGroup :validator="$v.closeDate">
                <b-datepicker
                  v-model="closeDate"
                  :append-to-body="true"
                  :first-day-of-week="1"
                  icon="calendar-today"
                >
                </b-datepicker>
              </FormGroup>
            </b-field>
          </div>
        </div>

        <div class="columns">
          <div class="column">
            <b-field label="Цена покупки:">
              <FormGroup :validator="$v.form.buyPrice">
                <b-input
                  type="text"
                  icon="currency-usd"
                  v-model.trim="form.buyPrice"
                >
                </b-input>
              </FormGroup>
            </b-field>
          </div>

          <div class="column">
            <b-field label="Цена продажи:">
              <FormGroup :validator="$v.form.sellPrice">
                <b-input
                  type="text"
                  icon="currency-usd"
                  v-model.trim="form.sellPrice"
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
        <button
          native-type="submit"
          :disabled="isFormSubmit"
          :loading="isFormSubmit"
          class="button is-primary"
        >
          {{ getModalActoinButtonText }}
        </button>
        <b-button label="Отмена" @click="$emit('close')" />
      </footer>
    </div>
  </form>
</template>

<script lang="ts">
import HelperMixin from "@/mixins/helper";
import { mapActions } from "vuex";
import { Trade, TempTradeToUpdate } from "@/types/portfolio";
import { decimal, required, numeric } from "vuelidate/lib/validators";
import messages from "@/utils/messages";
import FormGroup from "@/components/partials/form/FormGroup.vue";

export default HelperMixin.extend({
  name: "AddTradeModal",

  components: {
    FormGroup,
  },

  props: {
    type: String,
    portfolioId: String,
    tradeId: String,
    trade: Object,
  },

  data() {
    return {
      openDate: null as Date | null,
      closeDate: new Date() as Date | null,
      isFormSubmit: false as boolean,
      form: {
        ticker: "",
        quantity: "",
        openDate: null,
        closeDate: null,
        buyPrice: "",
        sellPrice: "",
        comment: "",
      } as Trade,
    };
  },

  computed: {
    getModalActionText(): string {
      if (this.type === "add" || this.type === "update") {
        return messages.modal[this.type];
      }

      return "";
    },

    getModalActoinButtonText(): string {
      if (this.type === "add" || this.type === "update") {
        return messages.modal.button[this.type];
      }

      return "";
    },
  },

  validations: {
    openDate: {
      required,
    },
    closeDate: {
      required,
    },
    form: {
      ticker: {
        required,
      },
      quantity: {
        numeric,
        required,
      },
      buyPrice: {
        decimal,
        required,
      },
      sellPrice: {
        decimal,
        required,
      },
    },
  },

  watch: {
    "form.ticker": function(val: string): void {
      this.form.ticker = val.toUpperCase();
    },
  },

  mounted() {
    if (this.trade && this.type === "update") {
      this.openDate = new Date(this.trade.openDate);
      this.closeDate = new Date(this.trade.closeDate);
      this.form = this.trade;
    }

    // Focus on first field
    this.makeFocusOnTextField(this, "ticker");
  },

  methods: {
    ...mapActions({
      addTrade: "portfolio/ADD_TRADE",
      updateTrade: "portfolio/UPDATE_TRADE",
    }),

    async handleSubmit(): Promise<void> {
      // Validate
      this.$v.$touch();

      if (!this.$v.$invalid) {
        try {
          this.isFormSubmit = true;
          if (this.openDate !== null) {
            this.form.openDate = this.openDate.getTime();
          }

          if (this.closeDate !== null) {
            this.form.closeDate = this.closeDate.getTime();
          }

          this.form.ticker = this.form.ticker.toUpperCase();

          if (this.type === "add") {
            const trade: TempTradeToUpdate = {
              portfolioId: this.portfolioId,
              data: this.form,
            };

            await this.addTrade(trade);
          } else if (this.type === "update") {
            const trade: TempTradeToUpdate = {
              portfolioId: this.portfolioId,
              id: this.tradeId,
              data: this.form,
            };

            await this.updateTrade(trade);
          }

          // Notification
          this.$buefy.notification.open({
            message: messages.trade[`success-${this.type}`],
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
  },
});
</script>
