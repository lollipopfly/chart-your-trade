import Vue from "vue";
import VueRouter from "vue-router";
import Registration from "@/components/views/Registration.vue";
import Login from "@/components/views/Login.vue";
import Home from "@/components/views/Home.vue";
import NotFound from "@/components/views/NotFound.vue";

Vue.use(VueRouter);

const defaultLayout = "DefaultLayout";
const routes = [
  {
    path: "/registration",
    name: "Registration",
    component: Registration,
    meta: {
      layout: defaultLayout,
      title: "Регистрация",
    },
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      layout: defaultLayout,
      title: "Авторизация",
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

export default router;
