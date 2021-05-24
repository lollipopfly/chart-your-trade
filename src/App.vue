<template>
  <div id="app">
    <component :is="layout">
      <router-view />
    </component>
  </div>
</template>

<script>
import DefaultLayout from "@/components/layouts/DefaultLayout.vue";
import DashboardLayout from "@/components/layouts/DashboardLayout.vue";

export default {
  name: "App",
  components: {
    DefaultLayout,
    DashboardLayout,
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
