export default {
  methods: {
    convertToArray(obj) {
      let arr = [];

      if (obj !== undefined) {
        arr = Object.entries(obj);
      }
      
      return arr;
    },
  },
};
