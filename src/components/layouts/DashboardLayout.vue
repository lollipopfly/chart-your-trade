<template>
  <div>
    <Header />
    <main class="main main--dashboard">
      <slot />
    </main>
    <Footer />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Header from "@/components/partials/Header.vue";
import Footer from "@/components/partials/Footer.vue";

export default Vue.extend({
  name: "DashboardLayout",
  components: {
    Header,
    Footer,
  },
});
</script>
