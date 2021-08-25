import Vue from "vue";

export default Vue.extend({
  methods: {
    makeFocusOnTextField(context: any, key: string): void {
      const nameInput = context.$refs[key];

      nameInput.focus();
    },
  },
});
