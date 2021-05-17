<template>
  <div id="app">
    <component :is="layout">
      <router-view />
    </component>
  </div>
</template>

<script>
import DefaultLayout from "@/components/layouts/DefaultLayout.vue";
import PortfolioLayout from "@/components/layouts/PortfolioLayout.vue";

export default {
  name: "App",
  components: {
    DefaultLayout,
    PortfolioLayout,
  },

  watch: {
    $route: {
      immediate: true,
      handler(to) {
        document.title = to.meta.title || "ChartYourTrade";
      },
    },
  },

  computed: {
    layout() {
      return this.$route.meta.layout || "default-layout";
    },
  },
};
</script>

<style src="buefy/dist/buefy.css"></style>

<style>
@import "assets/css/app.css";
</style>
