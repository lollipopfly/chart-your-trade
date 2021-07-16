import Vue from "vue";
import VueMeta from "vue-meta";
import App from "./App";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import router from "./router";
import store from "./store";
import Buefy from "buefy";
import "@mdi/font/css/materialdesignicons.css";
import Vuelidate from "vuelidate";
import vuelidateErrorExtractor from "vuelidate-error-extractor";
import customFormGroup from "./components/partials/form/FormGroup.vue";
import messages from "./utils/messages";
import currency from "./filters/currency";
import date from "./filters/date";
import percent from "./filters/percent";

Vue.use(VueMeta);
Vue.use(Buefy);
Vue.use(Vuelidate);
Vue.use(vuelidateErrorExtractor, {
  template: customFormGroup,
  messages: {
    decimal: messages.validation["decimal"],
    email: messages.validation["email"],
    greaterThanZero: messages.validation["greaterThanZero"],
    minLength: messages.validation["minLength"],
    numeric: messages.validation["numeric"],
    required: messages.validation["required"],
    zeroOrGreater: messages.validation["zeroOrGreater"],
  },
});

Vue.filter("currency", currency);
Vue.filter("date", date);
Vue.filter("percent", percent);

Vue.config.productionTip = false;

const firebaseConfig = {
  apiKey: "AIzaSyBUnDIUd1Ko_X1EUiGkZ6z0K5ptP1HMxME",
  authDomain: "chart-your-trade.firebaseapp.com",
  databaseURL:
    "https://chart-your-trade-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "chart-your-trade",
  storageBucket: "chart-your-trade.appspot.com",
  messagingSenderId: "653528494867",
  appId: "1:653528494867:web:6cbe527580a93c028be0e6",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

firebase.auth().onAuthStateChanged(async (firebaseUser) => {
  new Vue({
    router,
    store,
    render: (h) => h(App),
    created() {
      if (firebaseUser) {
        this.$store.commit("user/SET_USER", firebaseUser);
      }
    },
  }).$mount("#app");
});
