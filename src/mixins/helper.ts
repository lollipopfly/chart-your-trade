import Vue from "vue";

export default Vue.extend({
  methods: {
    convertToArray(obj: any) {
      let arr: any[] = [];

      if (obj !== undefined) {
        arr = Object.entries(obj);
      }

      return arr;
    },

    makeFocusOnTextField(context: any, key: string): void {
      // Avoid TS error
      const nameInput: any = context.$refs[key];

      nameInput.focus();
    },
  },
});
