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
          <div class="column portfolio__head__right">
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
          class="portfolio__tabs"
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
                <PieChart :trades="trades" />
              </b-tab-item>

              <b-tab-item icon="grid">
                <TreeMapChart :trades="trades" />
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

<script>
import { mapActions, mapState } from "vuex";
import messages from "@/components/utils/messages.js";
import TradesTable from "@/components/views/portfolio/single/TradesTable.vue";
import AddTradeModal from "@/components/partials/modals/AddTradeModal.vue";
import PieChart from "@/components/views/portfolio/single/PieChart.vue";
import TreeMapChart from "@/components/views/portfolio/single/TreeMapChart.vue";

export default {
  name: "PortfolioSingle",
  metaInfo() {
    return {
      title: "Портфель - " + this.title,
    };
  },
  components: {
    TradesTable,
    AddTradeModal,
    PieChart,
    TreeMapChart,
  },

  data() {
    return {
      title: "",
      portfolioId: this.$route.params.id,
      tradeId: null,
      currentTrade: {},
      activeTab: 0,
      isModalActive: false,
      modalType: "add",
      isLoading: true,
    };
  },

  computed: {
    ...mapState({
      trades: (state) => state.portfolio.currentPortfolio.trades,
    }),
  },

  async mounted() {
    this.getPortfolio();
  },

  methods: {
    ...mapActions({
      getPortfolioById: "portfolio/FETCH_PORTFOLIO_BY_ID",
      removeTrade: "portfolio/REMOVE_TRADE",
    }),

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

    showModal(type, tradeId, trade) {
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
};
</script>

<style>
.back__link {
  margin-bottom: 30px;
}
.back__link:hover .icon {
  color: #363636 !important;
}

.portfolio__tabs > .tab-content {
  padding-left: 0;
  padding-right: 0;
}
.portfolio__table__last__col {
  padding-left: 1.45em !important;
  padding-right: 1.45em !important;
}
</style>
