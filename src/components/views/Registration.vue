<template>
  <form class="box box--auth" @submit.prevent="handleSubmit">
    <h1 class="title">Регистрация</h1>

    <div class="field">
      <label class="label">Email*</label>
      <FormGroup :validator="$v.email">
        <b-input type="text" v-model.trim="email"> </b-input>
      </FormGroup>
    </div>

    <div class="field">
      <label class="label">Пароль*</label>
      <FormGroup :validator="$v.password">
        <b-input type="text" v-model.trim="password"> </b-input>
      </FormGroup>
    </div>

    <button
      type="submit"
      class="button is-primary"
      :class="{ 'is-loading': this.loading }"
      :disabled="this.loading"
    >
      Регистрация
    </button>
  </form>
</template>

<script>
import { mapState } from "vuex";
import { required, minLength, email } from "vuelidate/lib/validators";
import messages from "@/utils/messages";
import FormGroup from "@/components/partials/form/FormGroup.vue";

export default {
  name: "Registration",
  metaInfo: {
    title: "Регистрация",
  },

  components: {
    FormGroup,
  },

  data() {
    return {
      email: "",
      password: "",
    };
  },

  validations: {
    email: {
      required,
      email,
    },
    password: {
      required,
      minLength: minLength(6),
    },
  },

  computed: {
    ...mapState({
      loading: (state) => state.user.loading,
    }),
  },

  methods: {
    async handleSubmit() {
      // Validate
      this.$v.$touch();

      if (!this.$v.$invalid) {
        const formData = {
          email: this.email,
          password: this.password,
        };

        try {
          await this.$store.dispatch("user/REGISTER", formData);

          // Notification
          this.$buefy.notification.open({
            message: messages.auth["auth/success-registration"],
            type: "is-success",
          });

          // Redirection
          this.$router.push({ path: "login" });
        } catch (error) {
          // Notification
          this.$buefy.notification.open({
            duration: 5000,
            message: messages.auth[error.code] || "Что-то пошло не так!",
            type: "is-danger",
          });
        }
      }
    },
  },
};
</script>
