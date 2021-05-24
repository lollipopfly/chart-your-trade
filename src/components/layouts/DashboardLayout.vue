<template>
  <div>
    <Header />
    <main class="main main--dashboard">
      <slot />
    </main>
    <Footer />
  </div>
</template>

<script>
import Header from "@/components/partials/Header.vue";
import Footer from "@/components/partials/Footer.vue";

export default {
  name: "DashboardLayout",
  components: {
    Header,
    Footer,
  },
};
</script>
