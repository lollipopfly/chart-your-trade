<template>
  <div class="container">
    <div class="columns">
      <div class="column is-10 is-offset-1 has-text-centered">
        <h1 class="title home__title">Chart Your Trade</h1>

        <p class="home__text" v-if="currentQuote">
          <i>«{{ this.currentQuote.text }}».</i>
          - <span>{{ this.currentQuote.author }}</span>
        </p>

        <button class="button is-primary">Начать</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      quotes: [
        {
          author: "Пол Самуэльсон",
          text:
            "Инвестирование должно напоминать наблюдение за тем, как сохнет краска или как растет трава. Если вам нужен азарт, то возьмите 800 долларов и поезжайте в Лас-Вегас.",
        },
        {
          author: "Уоррен Баффетт",
          text:
            "Нам не нужно быть умнее остальных. Мы должны быть более дисциплинированы, чем остальные.",
        },
        {
          author: "Уоррен Баффетт",
          text:
            "Самое лучшее время инвестировать — вчера. Можно начать и сегодня. Чем раньше вы начнете инвестировать, тем лучше.",
        },
        {
          author: "Джейсон Цвейг",
          text:
            "Когда на рынке царит жадность или страх, люди начинают мыслить одинаково. Поэтому очень часто многие покупают на вершине рынка, а продают на дне.",
        },
        {
          author: "Пол Клитероу",
          text:
            "Инвестируйте в себя. Ваша карьера – это мотор вашего богатства.",
        },
        {
          author: "Бенджамин Франклин",
          text: "Инвестиции в знания платят лучшие дивиденды.",
        },
      ],
      currentQuote: null,
    };
  },

  mounted() {
    this.getRandomQuote();
  },

  methods: {
    getRandomQuote: function() {
      const index = this.getRandomInt(0, this.quotes.length);

      this.currentQuote = this.quotes[index];
    },

    getRandomInt: function(min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    },
  },
};
</script>

<style>
.home__title {
  text-transform: uppercase;
  font-size: 80px;
  margin-bottom: 40px !important;
}
.home__text {
  margin-bottom: 50px;
  font-size: 18px;
}
.home__text span {
  font-weight: 500;
}
@media (max-width: 991px) {
  .home__title {
    font-size: 60px;
  }
}
@media (max-width: 767px) {
  .home__title {
    font-size: 50px;
  }
}
</style>
