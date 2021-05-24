<template>
  <div class="container is-widescreen" v-if="currentPortfolio">
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
            <b-button type="is-primary" icon-left="plus"> </b-button>
          </div>
        </div>

        <div class="tabs">
          <ul>
            <li class="is-active"><a>Сделки</a></li>
            <li><a>График</a></li>
          </ul>
        </div>

        <div class="table-container">
          <table class="table is-fullwidth">
            <thead>
              <tr>
                <th>#</th>
                <th>Тикер</th>
                <th>Дата откр.</th>
                <th>Дата закр.</th>
                <th>Кол-во</th>
                <th>Цена покупки</th>
                <th>Цена продажи</th>
                <th>Процент</th>
                <th>Профит</th>
                <th>Комментарий</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>TCS</td>
                <td>1.4.2021</td>
                <td>12.4.2021</td>
                <td>12</td>
                <td>$3</td>
                <td>$68</td>
                <td>36%</td>
                <td>$32</td>
                <td>Lorem ipsum dolor sit ame</td>
                <td>
                  <div class="buttons">
                    <b-button
                      title="Редактировать сделку"
                      icon-left="pencil"
                      size="is-small"
                    ></b-button>
                    <b-button
                      type="is-danger"
                      title="Удалить сделку"
                      icon-left="trash-can"
                      size="is-small"
                      outlined
                    ></b-button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import messages from "@/components/utils/messages.js";

export default {
  name: "PortfolioSingle",
  metaInfo() {
    return {
      title: "Портфель - " + this.title,
    };
  },

  data() {
    return {
      title: "",
    };
  },

  mounted() {
    this.getPortfolio();
  },

  computed: {
    ...mapState({
      currentPortfolio: (state) => state.portfolio.currentPortfolio,
    }),
  },

  methods: {
    ...mapActions({
      getPortfolioById: "portfolio/FETCH_PORTFOLIO_BY_ID",
    }),

    async getPortfolio() {
      let portfolioId = this.$route.params.id;

      try {
        const portfolio = await this.getPortfolioById(portfolioId);

        // Redirect if null
        if (!portfolio) {
          this.$router.push("/portfolio");
        } else {
          this.title = portfolio.name;
        }
      } catch (error) {
        this.$buefy.notification.open({
          duration: 5000,
          message: messages.error["something-went-wrong"],
          type: "is-danger",
        });
      }
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
</style>
