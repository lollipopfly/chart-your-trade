<template>
  <div class="container">
    <b-loading v-model="isLoading"></b-loading>

    <div class="columns">
      <div class="column">
        <div class="portfolio__head columns">
          <div class="column is-four-fourths">
            <h1 class="title portfolio__head__title">{{ pageTitle }}</h1>
          </div>
          <div class="column page__head__right">
            <b-button
              type="is-primary"
              icon-left="plus"
              @click="showModal('add')"
            >
              Добавить портфель
            </b-button>
          </div>
        </div>
        <transition-group
          name="fade"
          class="panel is-danger"
          v-if="portfolioList"
        >
          <router-link
            class="panel-block portfolio__item"
            v-for="(portfolio, id) in portfolioList"
            :key="id + '-portfolio'"
            :to="'/portfolio/' + id"
          >
            <span class="panel-icon has-text-info">
              <b-icon icon="briefcase" size="is-small"></b-icon>
            </span>

            <div>
              {{ portfolio.name }}
              <span
                v-if="
                  getPortfolioProfit(portfolio.trades) > 0 ||
                    getPortfolioProfit(portfolio.trades) < 0
                "
                :class="getProfitClass(portfolio.trades)"
              >
                ({{ getPortfolioProfit(portfolio.trades) | currency }})
              </span>
            </div>

            <div class="portfolio__item__actions buttons">
              <b-button
                @click.prevent="showModal('update', id, portfolio.name)"
                title="Редактировать портфель"
                icon-left="pencil"
                size="is-small"
              ></b-button>
              <b-button
                @click.prevent="removePortfolioById(id)"
                type="is-danger"
                title="Удалить портфель"
                icon-left="trash-can"
                size="is-small"
                outlined
              ></b-button>
            </div>
          </router-link>
        </transition-group>
      </div>

      <b-modal
        v-model="isModalActive"
        :destroy-on-hide="true"
        aria-modal
        :width="640"
        @close="clearModalForm"
      >
        <template #default="props">
          <AddPortfolioModal
            :type="modalType"
            :portfolioId="portfolioId"
            :portfolioName="portfolioName"
            @close="props.close"
          ></AddPortfolioModal>
        </template>
      </b-modal>
    </div>
  </div>
</template>

<script lang="ts">
import { MetaInfo } from "vue-meta";
import { mapState } from "vuex";
import { mapActions } from "vuex";
import messages from "@/utils/messages";
import { State } from "@/types/state";
import { Profit, Trade } from "@/types/portfolio";
import AddPortfolioModal from "@/components/partials/modals/AddPortfolioModal.vue";
import tradeMixin from "@/mixins/trade";

export default tradeMixin.extend({
  name: "PortfolioOverview",

  metaInfo(): MetaInfo {
    return {
      title: "Портфели",
    };
  },

  props: {
    pageTitle: String,
  },

  components: {
    AddPortfolioModal,
  },

  data() {
    return {
      isModalActive: false as boolean,
      modalType: "add" as string,
      portfolioId: null as string | null,
      portfolioName: null as string | null,
      isLoading: false as boolean,
    };
  },

  computed: {
    ...mapState({
      fee: (state) => (state as State).user.profile.brokerFeePercent,
      portfolioList: (state) => (state as State).portfolio.list,
    }),
  },

  async mounted() {
    this.toggleLoading();

    await this.fetchUserProfile();
    await this.fetchPortfolioList();

    this.toggleLoading();
  },

  methods: {
    ...mapActions({
      fetchUserProfile: "user/FETCH_USER_PROFILE",
      fetchPortfolioList: "portfolio/FETCH_PORTFOLIO_LIST",
      removePortfolio: "portfolio/REMOVE_PORTFOLIO",
    }),

    showModal(type: string, portfolioId: string, portfolioName: string): void {
      if (type === "update") {
        this.portfolioId = portfolioId;
        this.portfolioName = portfolioName;
      }

      this.modalType = type;
      this.isModalActive = true;
    },

    clearModalForm(): void {
      this.portfolioId = null;
      this.portfolioName = null;
    },

    removePortfolioById(id: string): void {
      if (confirm(messages.actions["sure-question"])) {
        this.removePortfolio(id);
      }
    },

    getPortfolioProfit(trades: Trade[]): number {
      let profit: Profit = 0;
      let profitSum: number = 0;

      for (const key in trades) {
        if (
          Object.prototype.hasOwnProperty.call(trades, key) &&
          this.fee !== null
        ) {
          const { buyPrice, sellPrice, quantity } = trades[key];
          profit = this.getProfit(buyPrice, sellPrice, quantity, this.fee);

          if (profit !== null) {
            profitSum += profit;
          }
        }
      }

      return parseFloat(profitSum.toFixed(2));
    },

    getProfitClass(trades: Trade[]): string {
      let portfolioProfit: number = this.getPortfolioProfit(trades);

      if (portfolioProfit > 0) {
        return "has-text-success";
      } else if (portfolioProfit < 0) {
        return "has-text-danger";
      }

      return "";
    },

    toggleLoading(): void {
      this.isLoading = !this.isLoading;
    },
  },
});
</script>
