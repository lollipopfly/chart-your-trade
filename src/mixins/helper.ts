export default {
  methods: {
    convertToArray(obj: any) {
      let arr: any[] = [];

      if (obj !== undefined) {
        arr = Object.entries(obj);
      }

      return arr;
    },
  },
};
