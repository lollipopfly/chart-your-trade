<template>
  <div class="container">
    <div class="columns">
      <div class="column">
        <div class="portfolio__head columns">
          <div class="column is-four-fourths">
            <h1 class="title portfolio__head__title">{{ pageTitle }}</h1>
          </div>
          <div class="column portfolio__head__right">
            <b-button type="is-primary" icon-left="plus" @click="showModal()">
              Добавить портфель
            </b-button>
          </div>
        </div>
        <div class="panel is-danger" v-if="this.portfolioList">
          <a
            class="panel-block portfolio__item"
            v-for="(portfolio, index) in portfolioList"
            :key="index"
          >
            <span class="panel-icon has-text-info">
              <b-icon icon="briefcase" size="is-small"></b-icon>
            </span>
            {{ portfolio.title }}
            <div class="portfolio__item__actions buttons">
              <b-button
                title="Редактировать портфель"
                icon-left="pencil"
                size="is-small"
              ></b-button>
              <b-button
                @click="removePortfolio(index)"
                type="is-danger"
                title="Удалить портфель"
                icon-left="trash-can"
                size="is-small"
                outlined
              ></b-button>
            </div>
          </a>
        </div>
      </div>

      <b-modal
        v-model="isModalActive"
        :destroy-on-hide="true"
        aria-modal
        :width="640"
      >
        <template #default="props">
          <AddPortfolioModal @close="props.close"></AddPortfolioModal>
        </template>
      </b-modal>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { mapActions } from "vuex";
import AddPortfolioModal from "@/components/partials/modals/AddPortfolioModal.vue";

export default {
  name: "Portfolio",
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
    };
  },

  mounted() {
    this.fetchPortfolioList();
  },

  methods: {
    ...mapActions({
      fetchPortfolioList: "portfolio/FETCH_PORTFOLIO_LIST",
      removePortfolioById: "portfolio/REMOVE_PORTFOLIO",
    }),

    showModal() {
      this.isModalActive = true;
    },

    removePortfolio(id) {
      this.removePortfolioById(id);
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
