<template>
  <footer class="footer">
    <div class="content has-text-centered">
      <p>
        © {{ initYear }}
        <span v-if="currentYear > initYear"> - {{ currentYear }}</span>
        Chartyourtrade
      </p>
    </div>
  </footer>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Footer",

  data() {
    return {
      initYear: 2021 as number,
      currentYear: new Date().getFullYear() as number,
    };
  },
});
</script>

<style scoped>
footer.footer {
  padding: 3rem 1.5rem 3rem;
}
</style>
