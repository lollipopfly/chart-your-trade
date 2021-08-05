<template>
  <form class="box box--auth" @submit.prevent="handleSubmit">
    <h1 class="title">Авторизация</h1>

    <div class="field">
      <label class="label">Email</label>
      <FormGroup :validator="$v.email">
        <b-input type="text" v-model.trim="email"> </b-input>
      </FormGroup>
    </div>

    <div class="field">
      <label class="label">Пароль</label>
      <FormGroup :validator="$v.password">
        <b-input type="password" v-model.trim="password" password-reveal>
        </b-input>
      </FormGroup>
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

<script lang="ts">
import Vue from "vue";
import { MetaInfo } from "vue-meta";
import { mapState } from "vuex";
import { required, email } from "vuelidate/lib/validators";
import messages from "@/utils/messages";
import FormGroup from "@/components/partials/form/FormGroup.vue";

export default Vue.extend({
  name: "Login",

  metaInfo(): MetaInfo {
    return {
      title: "Авторизация",
    };
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
      email,
      required,
    },
    password: {
      required,
    },
  },

  computed: {
    ...mapState({
      loading: (state: any) => state.user.loading,
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
          this.$router.push({ path: "/portfolio" }).catch(() => {});
        } catch (error) {
          // Notification
          this.$buefy.notification.open({
            duration: 5000,
            message:
              messages.auth[error.code] ||
              messages.error["something-went-wrong"],
            type: "is-danger",
          });
        }
      }
    },
  },
});
</script>
