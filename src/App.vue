<template>
  <div id="app">
    <component :is="layout">
      <router-view />
    </component>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import DefaultLayout from "@/components/layouts/DefaultLayout.vue";
import DashboardLayout from "@/components/layouts/DashboardLayout.vue";

export default Vue.extend({
  name: "App",
  components: {
    DefaultLayout,
    DashboardLayout,
  },

  computed: {
    layout(): string {
      return this.$route.meta.layout || "default-layout";
    },
  },
});
</script>

<style src="buefy/dist/buefy.css"></style>

<style>
@import "assets/css/app.css";
</style>
