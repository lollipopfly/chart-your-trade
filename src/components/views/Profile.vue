<template>
  <div class="container">
    <b-loading v-model="isLoading"></b-loading>
    <div class="columns">
      <div class="column">
        <h1 class="title mb-6">Профиль</h1>

        <form @submit.prevent="handleSubmit">
          <div class="mb-6">
            <div class="columns">
              <div class="column is-one-third">
                <b-field label="Комиссия брокера за сделку:">
                  <FormGroup :validator="$v.form.brokerFeePercent">
                    <b-input
                      type="text"
                      v-model.trim="form.brokerFeePercent"
                      icon="percent"
                    ></b-input>
                  </FormGroup>
                </b-field>
              </div>
            </div>
          </div>

          <button type="submit" class="button is-primary">
            Обновить
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { decimal, required } from "vuelidate/lib/validators";
import FormGroup from "@/components/partials/form/FormGroup.vue";
import messages from "@/utils/messages.js";
import { zeroOrGreater } from "@/validations/validations.js";

export default {
  name: "Profile",
  metaInfo: {
    title: "Профиль",
  },
  components: {
    FormGroup,
  },

  data() {
    return {
      isLoading: true,
      form: {
        brokerFeePercent: null,
      },
    };
  },

  validations: {
    form: {
      brokerFeePercent: {
        decimal,
        required,
        zeroOrGreater,
      },
    },
  },

  mounted() {
    this.getUserProfile();
  },

  computed: {
    ...mapState({
      fee: (state) => state.user.profile.brokerFeePercent,
    }),
  },

  methods: {
    ...mapActions({
      fetchUserProfile: "user/FETCH_USER_PROFILE",
      setUserProfile: "user/SET_USER_PROFILE",
    }),

    async getUserProfile() {
      await this.fetchUserProfile();

      this.form.brokerFeePercent = this.fee;
      this.isLoading = false;
    },

    async handleSubmit() {
      // Validate
      this.$v.$touch();

      if (!this.$v.$invalid) {
        try {
          await this.setUserProfile(this.form);

          // Notification
          this.$buefy.notification.open({
            message: messages.profile["success-update"],
            type: "is-success",
          });
        } catch (error) {
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
