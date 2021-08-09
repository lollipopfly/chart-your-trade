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

<script lang="ts">
import Vue from "vue";
import { MetaInfo } from "vue-meta";
import { mapActions, mapState } from "vuex";
import { decimal, required } from "vuelidate/lib/validators";
import { zeroOrGreater } from "@/validations/validations";
import { State } from "@/types/state";
import messages from "@/utils/messages";
import FormGroup from "@/components/partials/form/FormGroup.vue";

export default Vue.extend({
  name: "Profile",

  metaInfo(): MetaInfo {
    return {
      title: "Профиль",
    };
  },

  components: {
    FormGroup,
  },

  data() {
    return {
      isLoading: true as boolean,
      form: {
        brokerFeePercent: null as string | null,
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
      fee: (state): string | null =>
        (state as State).user.profile.brokerFeePercent,
    }),
  },

  methods: {
    ...mapActions({
      fetchUserProfile: "user/FETCH_USER_PROFILE",
      setUserProfile: "user/SET_USER_PROFILE",
    }),

    async getUserProfile(): Promise<void> {
      await this.fetchUserProfile();

      this.form.brokerFeePercent = this.fee;
      this.isLoading = false;
    },

    async handleSubmit(): Promise<void> {
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
});
</script>
