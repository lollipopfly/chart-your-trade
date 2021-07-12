<template>
  <div class="container">
    <div class="columns">
      <div class="column">
        <div class="columns">
          <div class="column is-four-fourths">
            <div class="dividends__head">
              <h1 class="title">Дивиденды</h1>
            </div>
          </div>
          <div class="column page__head__right">
            <b-button
              type="is-primary"
              icon-left="plus"
              @click="showModal('add')"
              >Добавить</b-button
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
          <b-tab-item label="Дивиденды" icon="cash-multiple">
            <DividendsTable
              :dividends="dividends"
              :isLoading="isLoading"
              @onShowModal="showModal"
            />
          </b-tab-item>
          <b-tab-item label="Аналитика" icon="chart-line">
            <b-tabs vertical :animated="false" :destroy-on-hide="true">
              <b-tab-item icon="chart-arc">
                <PieChart
                  type="dividend"
                  :data="dividends"
                  :emptyChartText="emptyPieChartText"
                />
              </b-tab-item>
              <b-tab-item icon="chart-bell-curve-cumulative">
                <LineChart :data="dividends" />
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
        <AddDividendModal
          :type="modalType"
          :dividendId="dividendId"
          :dividend="currentDividend"
          @close="props.close"
        ></AddDividendModal>
      </template>
    </b-modal>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import messages from "@/components/utils/messages.js";
import DividendsTable from "@/components/views/dividends/DividendsTable.vue";
import PieChart from "@/components/charts/PieChart.vue";
import LineChart from "@/components/charts/LineChart.vue";
import AddDividendModal from "@/components/partials/modals/AddDividendModal.vue";

export default {
  metaInfo: {
    title: "Дивиденды",
  },

  name: "Dividends",

  components: {
    AddDividendModal,
    DividendsTable,
    LineChart,
    PieChart,
  },

  props: {
    pageTitle: String,
  },

  data() {
    return {
      activeTab: 0,
      dividendId: null,
      isModalActive: false,
      currentDividend: {},
      modalType: "add",
      isLoading: true,
      emptyPieChartText: messages.dividends["no-dividends"],
    };
  },

  computed: {
    ...mapState({
      dividends: (state) => state.dividends.list,
    }),
  },

  mounted() {
    this.getDividends();
  },

  methods: {
    ...mapActions({
      fetchDividends: "dividends/FETCH_DIVIDENDS",
    }),

    async getDividends() {
      try {
        await this.fetchDividends();

        this.isLoading = false;
      } catch (error) {
        this.$buefy.notification.open({
          duration: 5000,
          message: messages.error["something-went-wrong"],
          type: "is-danger",
        });
      }
    },

    showModal(type, dividendId, dividend) {
      if (type === "update") {
        this.dividendId = dividendId;
        this.currentDividend = dividend;
      }

      this.modalType = type;
      this.isModalActive = true;
    },

    clearModalForm() {
      this.currentDividend = {};
      this.dividendId = null;
    },
  },
};
</script>

<style>
.dividends__head {
  margin-bottom: 55px;
}
</style>
