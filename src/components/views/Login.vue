<template>
  <form class="box box--auth" @submit.prevent="handleSubmit">
    <h1 class="title">Авторизация</h1>

    <div class="field">
      <label class="label">Email</label>
      <div class="control">
        <input
          type="text"
          v-model.trim="email"
          class="input"
          :class="{ 'is-danger': $v.email.$error }"
        />

        <!-- Error message-->
        <div class="help is-danger" v-if="$v.email.$error">
          <span v-if="$v.email.$dirty && !$v.email.required"
            >Это поле обязательное</span
          >
          <span v-if="$v.email.$dirty && !$v.email.email"
            >Введите валидный Email</span
          >
        </div>
      </div>
    </div>

    <div class="field">
      <label class="label">Пароль</label>
      <div class="control">
        <input
          class="input"
          type="password"
          v-model.trim="password"
          :class="{ 'is-danger': $v.password.$error }"
        />
      </div>

      <!-- Error message -->
      <div class="help is-danger" v-if="$v.password.$error">
        <span v-if="$v.password.$dirty && !$v.password.required"
          >Это поле обязательное</span
        >
      </div>
    </div>

    <button
      type="submit"
      class="button is-primary"
      :class="{ 'is-loading': this.loading }"
      :disabled="this.loading"
    >
      Войти
    </button>
  </form>
</template>

<script>
import { mapState } from "vuex";
import { required, email } from "vuelidate/lib/validators";
import messages from "@/components/utils/messages";

export default {
  name: "Login",

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
          await this.$store.dispatch("user/LOGIN", formData);

          // Notification
          this.$buefy.notification.open({
            message: messages.auth["auth/success-login"],
            type: "is-success",
          });

          // Redirection
          this.$router.push({ path: "/" });
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

<style></style>
