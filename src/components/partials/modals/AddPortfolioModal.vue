<template>
  <form>
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">Добавить портфель</p>
      </header>
      <section class="modal-card-body">
        <b-field label="Название портфеля:">
          <FormGroup :validator="$v.title">
            <b-input
              type="text"
              v-model.trim="title"
              :class="{ 'is-danger': $v.title.$error }"
            >
            </b-input>
          </FormGroup>
        </b-field>
      </section>
      <footer class="modal-card-foot">
        <b-button @click="handleSubmit" label="Добавить" type="is-primary" />
        <b-button label="Отмена" @click="$emit('close')" />
      </footer>
    </div>
  </form>
</template>

<script>
import { required } from "vuelidate/lib/validators";
import messages from "@/components/utils/messages.js";
import FormGroup from "@/components/partials/form/FormGroup.vue";

export default {
  name: "AddPortfolioModal",
  components: {
    FormGroup,
  },

  data() {
    return {
      title: "",
    };
  },

  validations: {
    title: {
      required,
    },
  },

  methods: {
    async handleSubmit() {
      // Validate
      this.$v.$touch();

      if (!this.$v.$invalid) {
        try {
          await this.$store.dispatch("portfolio/ADD_PORTFOLIO", this.title);

          // Notification
          this.$buefy.notification.open({
            message: messages.portfolio["success-added"],
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
