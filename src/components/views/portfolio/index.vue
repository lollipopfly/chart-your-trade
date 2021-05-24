<template>
  <div class="container">
    <div class="columns">
      <div class="column">
        <div class="portfolio__head columns">
          <div class="column is-four-fourths">
            <h1 class="title portfolio__head__title">{{ pageTitle }}</h1>
          </div>
          <div class="column portfolio__head__right">
            <b-button
              type="is-primary"
              icon-left="plus"
              @click="showModal('add')"
            >
              Добавить портфель
            </b-button>
          </div>
        </div>
        <div class="panel is-danger" v-if="this.portfolioList">
          <router-link
            class="panel-block portfolio__item"
            v-for="(portfolio, id) in portfolioList"
            :key="id"
            :to="'/portfolio/' + id"
          >
            <span class="panel-icon has-text-info">
              <b-icon icon="briefcase" size="is-small"></b-icon>
            </span>
            {{ portfolio.name }}
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
        </div>
      </div>

      <b-modal
        v-model="isModalActive"
        :destroy-on-hide="true"
        aria-modal
        :width="640"
      >
        <template #default="props">
          <AddPortfolioModal
            :type="modalType"
            :currentPortfolioId="portfolioId"
            :currentPortfolioName="portfolioName"
            @close="props.close"
          ></AddPortfolioModal>
        </template>
      </b-modal>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { mapActions } from "vuex";
import messages from "@/components/utils/messages.js";
import AddPortfolioModal from "@/components/partials/modals/AddPortfolioModal.vue";

export default {
  name: "PortfolioOverview",
  components: {
    AddPortfolioModal,
  },
  props: {
    pageTitle: String,
  },

  computed: {
    ...mapState({
      portfolioList: (state) => state.portfolio.list,
    }),
  },

  data() {
    return {
      isModalActive: false,
      modalType: "add",
      portfolioId: null,
      portfolioName: null,
    };
  },

  mounted() {
    this.fetchPortfolioList();
  },

  methods: {
    ...mapActions({
      fetchPortfolioList: "portfolio/FETCH_PORTFOLIO_LIST",
      removePortfolio: "portfolio/REMOVE_PORTFOLIO",
    }),

    showModal(type, portfolioId, portfolioName) {
      if (type === "update") {
        this.portfolioId = portfolioId;
        this.portfolioName = portfolioName;
      }

      this.modalType = type;
      this.isModalActive = true;
    },

    removePortfolioById(id) {
      if (confirm(messages.actions["sure-question"])) {
        this.removePortfolio(id);
      }
    },
  },
};
</script>

<style>
.portfolio__head.columns {
  margin-bottom: 40px;
}
.portfolio__head__right {
  text-align: right;
}
@media (min-width: 768px) {
  .portfolio__head.columns {
    flex-grow: 1;
    flex-shrink: 0;
    align-items: stretch;
    display: flex;
  }
}
@media (max-width: 767px) {
  .portfolio__head__right {
    text-align: left;
  }
}
.portfolio__item__actions {
  margin-left: auto;
}
</style>
