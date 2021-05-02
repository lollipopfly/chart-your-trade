<template>
  <footer class="footer">
    <div class="content has-text-centered">
      <p>
        © {{ this.initYear }}
        <span v-if="this.currentYear > this.initYear">
          - {{ this.currentYear }}</span
        >
        Chartyourtrade
      </p>
    </div>
  </footer>
</template>

<script>
export default {
  name: "Footer",
  data() {
    return {
      initYear: 2021,
      currentYear: new Date().getFullYear(),
    };
  },
};
</script>

<style scoped>
footer.footer {
  padding: 3rem 1.5rem 3rem;
}
</style>
