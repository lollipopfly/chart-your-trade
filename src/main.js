import Vue from "vue";
import App from "./App";
import Vuelidate from "vuelidate";
import vuelidateErrorExtractor from "vuelidate-error-extractor";
import Buefy from "buefy";
import router from "./router";
import store from "./store";
import firebase from "firebase/app";
import "firebase/auth";
import customFormGroup from "./components/partials/form/FormGroup.vue";
import messages from "./components/utils/messages";

Vue.use(Buefy);
Vue.use(Vuelidate);
Vue.use(vuelidateErrorExtractor, {
  template: customFormGroup,
  messages: {
    email: messages.validation["emal"],
    numeric: messages.validation["numberic"],
    required: messages.validation["required"],
  },
});

Vue.config.productionTip = false;

const firebaseConfig = {
  apiKey: "AIzaSyBUnDIUd1Ko_X1EUiGkZ6z0K5ptP1HMxME",
  authDomain: "chart-your-trade.firebaseapp.com",
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
