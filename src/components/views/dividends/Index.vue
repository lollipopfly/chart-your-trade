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
              @click="showModal('add', '', null)"
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

<script lang="ts">
import Vue from "vue";
import { MetaInfo } from "vue-meta";
import { mapState, mapActions } from "vuex";
import messages from "@/utils/messages";
import { State } from "@/types/state";
import { CurrentDividend } from "@/types/dividends";
import DividendsTable from "@/components/views/dividends/DividendsTable.vue";
import PieChart from "@/components/charts/PieChart.vue";
import LineChart from "@/components/charts/LineChart.vue";
import AddDividendModal from "@/components/partials/modals/AddDividendModal.vue";

export default Vue.extend({
  metaInfo(): MetaInfo {
    return {
      title: "Дивиденды",
    };
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
      activeTab: 0 as number,
      dividendId: "" as string,
      isModalActive: false as boolean,
      modalType: "add" as string,
      currentDividend: null as CurrentDividend,
      isLoading: true as boolean,
      emptyPieChartText: messages.dividends["no-dividends"] as string,
    };
  },

  computed: {
    ...mapState({
      dividends: (state) => (state as State).dividends.list,
    }),
  },

  mounted() {
    this.getDividends();
  },

  methods: {
    ...mapActions({
      fetchDividends: "dividends/FETCH_DIVIDENDS",
    }),

    async getDividends(): Promise<void> {
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

    showModal(
      type: string,
      dividendId: string,
      dividend: CurrentDividend
    ): void {
      if (type === "update") {
        // delete id field from reactive dividend
        let dividendCopy = Object.assign({}, dividend);

        if (dividendCopy) {
          delete dividendCopy["id"];
        }

        this.dividendId = dividendId;
        this.currentDividend = dividendCopy;
      }

      this.modalType = type;
      this.isModalActive = true;
    },

    clearModalForm(): void {
      this.currentDividend = null;
      this.dividendId = "";
    },
  },
});
</script>

<style>
.dividends__head {
  margin-bottom: 55px;
}
</style>
