<template>
  <div :class="{ error: hasErrors }">
    <slot />
    <div class="help is-danger" v-if="hasErrors">
      <div :key="error" v-for="error in activeErrorMessages">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script>
import { singleErrorExtractorMixin } from "vuelidate-error-extractor";

export default {
  mixins: [singleErrorExtractorMixin],
};
</script>
