<template>
  <form class="box box--auth" @submit.prevent="handleSubmit">
    <h1 class="title">Регистрация</h1>

    <div class="field">
      <label class="label">Email*</label>
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
      <label class="label">Пароль*</label>
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
        <span v-if="$v.password.$dirty && !$v.password.minLength"
          >Пароль должен превышать
          {{ $v.password.$params.minLength.min }} символов</span
        >
      </div>
    </div>

    <button
      type="submit"
      class="button is-primary"
      :class="{ 'is-loading': isLoading }"
      :disabled="isLoading"
    >
      Регистрация
    </button>
  </form>
</template>

<script>
import { required, minLength, email } from "vuelidate/lib/validators";
import messages from "@/components/utils/messages";

export default {
  name: "Registration",
  data() {
    return {
      email: "",
      password: "",
      isLoading: false,
    };
  },
  validations: {
    email: {
      required,
      email,
    },
    password: {
      required,
      minLength: minLength(4),
    },
  },

  methods: {
    async handleSubmit() {
      // Validate
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.isLoading = true;

        const formData = {
          email: this.email,
          password: this.password,
        };

        try {
          await this.$store.dispatch("register", formData);
          this.isLoading = false;

          // Notification
          this.$buefy.notification.open({
            message: "Вы успешно зарегистрировались!",
            type: "is-success",
          });

          // Redirection
          this.$router.push({ path: "login" });
        } catch (error) {
          this.isLoading = false;

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
