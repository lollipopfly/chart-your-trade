<template>
  <form @submit.prevent="handleSubmit">
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">{{ getModalActionText }} портфель</p>
      </header>
      <section class="modal-card-body">
        <b-field label="Название портфеля:">
          <FormGroup :validator="$v.name">
            <b-input type="text" v-model.trim="name"> </b-input>
          </FormGroup>
        </b-field>
      </section>
      <footer class="modal-card-foot">
        <button type="submit" class="button is-primary">
          {{ getModalActoinButtonText }}
        </button>
        <b-button label="Отмена" @click="$emit('close')" />
      </footer>
    </div>
  </form>
</template>

<script>
import { mapActions } from "vuex";
import { required } from "vuelidate/lib/validators";
import messages from "@/components/utils/messages.js";
import FormGroup from "@/components/partials/form/FormGroup.vue";

export default {
  name: "AddPortfolioModal",
  components: {
    FormGroup,
  },
  props: {
    type: String,
    currentPortfolioId: String,
    currentPortfolioName: String,
  },

  data() {
    return {
      name: "",
    };
  },

  validations: {
    name: {
      required,
    },
  },

  computed: {
    getModalActionText() {
      return messages.modal[this.type];
    },

    getModalActoinButtonText() {
      return messages.modal.button[this.type];
    },
  },

  mounted() {
    if (this.currentPortfolioName) {
      this.name = this.currentPortfolioName;
    }
  },

  methods: {
    ...mapActions({
      addPortfolio: "portfolio/ADD_PORTFOLIO",
      updatePortfolioName: "portfolio/UPDATE_PORTFOLIO_NAME",
    }),

    async handleSubmit() {
      // Validate
      this.$v.$touch();

      if (!this.$v.$invalid) {
        try {
          if (this.type === "add") {
            await this.addPortfolio(this.name);
          } else if (this.type === "update") {
            const updatedPortfolio = {
              name: this.name,
              id: this.currentPortfolioId,
            };

            await this.updatePortfolioName(updatedPortfolio);
          }

          // Notification
          this.$buefy.notification.open({
            message: messages.portfolio[`success-${this.type}`],
            type: "is-success",
          });

          // Close modal
          this.$emit("close");
        } catch (error) {
          // Notification
          this.$buefy.notification.open({
            duration: 5000,
            message: messages.error["something-went-wrong"],
            type: "is-danger",
          });
        }
      }
    },
  },
};
</script>

<style></style>
