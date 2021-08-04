<template>
  <div class="container">
    <span class="back__link icon-text has-text-info">
      <router-link :to="{ name: 'portfolio' }">
        <span class="icon">
          <b-icon icon="arrow-left" type="is-primary" size="is-small"> </b-icon>
        </span>
        Назад</router-link
      >
    </span>

    <div class="columns">
      <div class="column">
        <div class="portfolio__head columns">
          <div class="column is-four-fourths">
            <h1 class="title portfolio__head__title">
              {{ title }}
            </h1>
          </div>
          <div class="column page__head__right">
            <b-button
              type="is-primary"
              icon-left="plus"
              @click="showModal('add')"
              >Добавить сделку</b-button
            >
          </div>
        </div>

        <b-tabs
          type="is-boxed"
          v-model="activeTab"
          :animated="false"
          :destroy-on-hide="true"
          class="page__tabs"
        >
          <b-tab-item label="Сделки" icon="handshake">
            <TradesTable
              :portfolioId="portfolioId"
              :trades="trades"
              :isLoading="isLoading"
              @onShowModal="showModal"
          /></b-tab-item>

          <b-tab-item label="Аналитика" icon="chart-bar">
            <b-tabs vertical :animated="false" :destroy-on-hide="true">
              <b-tab-item icon="chart-arc">
                <PieChart
                  type="trade"
                  :data="trades"
                  :emptyChartText="emptyPieChartText"
                />
              </b-tab-item>

              <b-tab-item icon="grid">
                <TreeMapChart :data="trades" />
              </b-tab-item>

              <b-tab-item icon="chart-scatter-plot">
                <ScatterChart :data="trades" />
              </b-tab-item>
            </b-tabs>
          </b-tab-item>
        </b-tabs>
      </div>
    </div>

    <b-modal
      v-model="isModalActive"
      :destroy-on-hide="true"
      aria-modal
      :width="640"
      @close="clearModalForm"
    >
      <template #default="props">
        <AddTradeModal
          :type="modalType"
          :portfolioId="portfolioId"
          :tradeId="tradeId"
          :trade="currentTrade"
          @close="props.close"
        ></AddTradeModal>
      </template>
    </b-modal>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions, mapState } from "vuex";
import { MetaInfo } from "vue-meta";
import messages from "@/utils/messages";
import TradesTable from "@/components/views/portfolio/single/TradesTable.vue";
import AddTradeModal from "@/components/partials/modals/AddTradeModal.vue";
import PieChart from "@/components/charts/PieChart.vue";
import TreeMapChart from "@/components/charts/TreeMapChart.vue";
import ScatterChart from "@/components/charts/ScatterChart.vue";

export default Vue.extend({
  name: "PortfolioSingle",

  metaInfo(): MetaInfo {
    return {
      title: "Портфель - " + this.title,
    };
  },

  components: {
    AddTradeModal,
    TradesTable,
    PieChart,
    ScatterChart,
    TreeMapChart,
  },

  data() {
    return {
      title: "" as string,
      emptyPieChartText: messages.trade["no-profit-trades"] as string,
      portfolioId: this.$route.params.id as string,
      tradeId: null as string | null,
      currentTrade: {} as any,
      activeTab: 0 as number,
      isModalActive: false as boolean,
      modalType: "add" as string,
      isLoading: true as boolean,
    };
  },

  computed: {
    ...mapState({
      trades: (state: any) => state.portfolio.currentPortfolio.trades,
    }),
  },

  mounted() {
    this.getProfileData();
  },

  methods: {
    ...mapActions({
      fetchUserProfile: "user/FETCH_USER_PROFILE",
      getPortfolioById: "portfolio/FETCH_PORTFOLIO_BY_ID",
      removeTrade: "portfolio/REMOVE_TRADE",
    }),

    async getProfileData() {
      await this.fetchUserProfile();
      await this.getPortfolio();
    },

    async getPortfolio() {
      try {
        const portfolio = await this.getPortfolioById(this.portfolioId);

        // Redirect if null
        if (!portfolio) {
          this.$router.push("/portfolio");
        } else {
          this.title = portfolio.name;
          this.isLoading = false;
        }
      } catch (error) {
        this.$buefy.notification.open({
          duration: 5000,
          message: messages.error["something-went-wrong"],
          type: "is-danger",
        });
      }
    },

    showModal(type: string, tradeId: string | null, trade: any) {
      if (type === "update") {
        this.tradeId = tradeId;
        this.currentTrade = trade;
      }

      this.modalType = type;
      this.isModalActive = true;
    },

    clearModalForm() {
      this.currentTrade = {};
      this.tradeId = null;
    },
  },
});
</script>

<style>
.back__link {
  margin-bottom: 30px;
}
.back__link:hover .icon {
  color: #363636 !important;
}
.portfolio__table__last__col {
  padding-left: 1.45em !important;
  padding-right: 1.45em !important;
}
</style>
