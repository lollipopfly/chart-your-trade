import Vue from "vue";
import VueRouter from "vue-router";
import firebase from "firebase/app";
import Registration from "@/components/views/Registration.vue";
import Login from "@/components/views/Login.vue";
import Home from "@/components/views/Home.vue";
import Portfolio from "@/components/views/Portfolio.vue";
import NotFound from "@/components/views/NotFound.vue";

import MiddlePriceCalculator from "@/components/views/instruments/MiddlePriceCalculator.vue";
import SellMiddlePriceCalculator from "@/components/views/instruments/SellMiddlePriceCalculator.vue";

Vue.use(VueRouter);

const defaultLayout = "DefaultLayout";
const PortfolioLayout = "PortfolioLayout";
const routes = [
  {
    path: "/registration",
    name: "Registration",
    component: Registration,
    meta: {
      layout: defaultLayout,
      title: "Регистрация",
      hideForLoggedIn: true,
    },
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      layout: defaultLayout,
      title: "Авторизация",
      hideForLoggedIn: true,
    },
  },
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      layout: defaultLayout,
      title: "Chartyourtrade",
    },
  },
  {
    path: "/portfolio",
    name: "Portfolio",
    component: Portfolio,
    meta: {
      layout: PortfolioLayout,
      title: "Портфолио",
    },
    props: { pageTitle: "Портфолио" },
  },
  {
    path: "/middle-price-calculator",
    meta: {
      layout: PortfolioLayout,
      title: "Калькулятор усреднения",
    },
    component: MiddlePriceCalculator,
    props: { pageTitle: "Калькулятор усреднения" },
  },
  {
    path: "/sell-middle-price-calculator",
    meta: {
      layout: PortfolioLayout,
      title: "Калькулятор усреднения продаж",
    },
    component: SellMiddlePriceCalculator,
    props: { pageTitle: 'Определение "средней" цены продаж акции.' },
  },
  {
    path: "*",
    name: "NotFound",
    component: NotFound,
    meta: {
      layout: defaultLayout,
      title: "404 - страница не найдена",
    },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  firebase.auth().onAuthStateChanged(function(user) {
    if (to.matched.some((record) => record.meta.hideForLoggedIn)) {
      if (user) {
        next("/");
      } else {
        next();
      }
    } else {
      next();
    }
  });
});

export default router;
