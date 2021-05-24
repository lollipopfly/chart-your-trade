import Vue from "vue";
import VueRouter from "vue-router";
import firebase from "firebase/app";

import Registration from "@/components/views/Registration.vue";
import Login from "@/components/views/Login.vue";

import Home from "@/components/views/Home.vue";
import PortfolioOverview from "@/components/views/portfolio/index.vue";
import PortfolioSingle from "@/components/views/portfolio/single.vue";

import MiddlePriceCalculator from "@/components/views/instruments/MiddlePriceCalculator.vue";
import SellMiddlePriceCalculator from "@/components/views/instruments/SellMiddlePriceCalculator.vue";

import NotFound from "@/components/views/NotFound.vue";

Vue.use(VueRouter);

const defaultLayout = "DefaultLayout";
const DashboardLayout = "DashboardLayout";
const routes = [
  // AUTH
  {
    path: "/registration",
    component: Registration,
    meta: {
      layout: defaultLayout,
      title: "Регистрация",
      hideForLoggedIn: true,
    },
  },
  {
    path: "/login",
    component: Login,
    meta: {
      layout: defaultLayout,
      title: "Авторизация",
      hideForLoggedIn: true,
    },
  },

  // PAGES
  {
    path: "/",
    component: Home,
    meta: {
      layout: defaultLayout,
      title: "Chartyourtrade",
    },
  },

  // PORTFOLIO
  {
    path: "/portfolio",
    component: PortfolioOverview,
    meta: {
      layout: DashboardLayout,
      title: "Портфолио",
      protected: true,
    },
    props: { pageTitle: "Портфолио" },
  },
  {
    path: "/portfolio/:id",
    component: PortfolioSingle,
    meta: {
      layout: DashboardLayout,
      protected: true,
      title: "Портфель",
    },
  },

  // INSTRUMENTS
  {
    path: "/middle-price-calculator",
    meta: {
      layout: DashboardLayout,
      title: "Калькулятор усреднения",
    },
    component: MiddlePriceCalculator,
    props: { pageTitle: "Калькулятор усреднения" },
  },
  {
    path: "/sell-middle-price-calculator",
    meta: {
      layout: DashboardLayout,
      title: "Калькулятор усреднения продаж",
    },
    component: SellMiddlePriceCalculator,
    props: { pageTitle: 'Определение "средней" цены продаж акции.' },
  },

  // OTHER
  {
    path: "*",
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
    } else if (to.matched.some((record) => record.meta.protected)) {
      if (!user) {
        next("/login");
      } else {
        next();
      }
    } else {
      next();
    }
  });
});

export default router;
