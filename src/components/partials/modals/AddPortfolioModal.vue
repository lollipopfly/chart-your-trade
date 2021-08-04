<template>
  <form @submit.prevent="handleSubmit">
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">{{ getModalActionText }} портфель</p>
      </header>
      <section class="modal-card-body">
        <b-field label="Название портфеля:">
          <FormGroup :validator="$v.name">
            <b-input type="text" ref="name" v-model.trim="name"> </b-input>
          </FormGroup>
        </b-field>
      </section>
      <footer class="modal-card-foot">
        <b-button
          native-type="submit"
          :disabled="isFormSubmit"
          :loading="isFormSubmit"
          class="button is-primary"
        >
          {{ getModalActoinButtonText }}
        </b-button>
        <b-button label="Отмена" @click="$emit('close')" />
      </footer>
    </div>
  </form>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions } from "vuex";
import { required } from "vuelidate/lib/validators";
import messages from "@/utils/messages";
import FormGroup from "@/components/partials/form/FormGroup.vue";

export default Vue.extend({
  name: "AddPortfolioModal",

  components: {
    FormGroup,
  },

  props: {
    type: String,
    portfolioId: String,
    portfolioName: String,
  },

  validations: {
    name: {
      required,
    },
  },

  data() {
    return {
      name: "" as string,
      isFormSubmit: false as boolean,
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

  mounted() {
    if (this.portfolioName) {
      this.name = this.portfolioName;
    }

    // Focus on first field
    const nameInput: any = this.$refs.name;
    // Avoid TS error
    nameInput.focus();
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
          this.isFormSubmit = true;

          if (this.type === "add") {
            await this.addPortfolio(this.name);
          } else if (this.type === "update") {
            const updatedPortfolio = {
              name: this.name,
              id: this.portfolioId,
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

<style></style>
