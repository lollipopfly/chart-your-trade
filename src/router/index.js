import Vue from "vue";
import VueRouter from "vue-router";
import firebase from "firebase/app";

import Registration from "@/components/views/Registration.vue";
import Login from "@/components/views/Login.vue";
import Profile from "@/components/views/Profile.vue";

import Home from "@/components/views/Home.vue";
import PortfolioOverview from "@/components/views/portfolio/Index.vue";
import PortfolioSingle from "@/components/views/portfolio/single/Index.vue";

import Dividends from "@/components/views/dividends/Index.vue";

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
      hideForLoggedIn: true,
    },
  },
  {
    path: "/login",
    component: Login,
    meta: {
      layout: defaultLayout,
      hideForLoggedIn: true,
    },
  },
  {
    path: "/profile",
    name: "profile",
    component: Profile,
    meta: {
      layout: DashboardLayout,
      protected: true,
    },
  },

  // PAGES
  {
    path: "/",
    component: Home,
    meta: {
      layout: defaultLayout,
    },
  },

  // PORTFOLIO
  {
    path: "/portfolio",
    component: PortfolioOverview,
    name: "portfolio",
    meta: {
      layout: DashboardLayout,
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
    },
  },

  // DIVIDENDS
  {
    path: "/dividends",
    name: "dividends",
    component: Dividends,
    meta: {
      layout: DashboardLayout,
      protected: true,
    },
    props: { pageTitle: "Дивиденды" },
  },

  // INSTRUMENTS
  {
    path: "/middle-price-calculator",
    name: "middle-price-calculator",
    meta: {
      layout: DashboardLayout,
    },
    component: MiddlePriceCalculator,
    props: { pageTitle: "Калькулятор усреднения" },
  },
  {
    path: "/sell-middle-price-calculator",
    name: "sell-middle-price-calculator",
    meta: {
      layout: DashboardLayout,
    },
    component: SellMiddlePriceCalculator,
    props: { pageTitle: 'Определение "средней" цены продажи акции.' },
  },

  // OTHER
  {
    path: "*",
    component: NotFound,
    meta: {
      layout: defaultLayout,
    },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  firebase.auth().onAuthStateChanged((user) => {
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
