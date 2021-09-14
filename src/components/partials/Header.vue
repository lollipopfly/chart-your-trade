<template>
  <header class="header">
    <div class="container">
      <nav class="navbar" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
          <router-link class="navbar-item" to="/">
            <img src="@/assets/images/logo.svg" class="navbar-brand__icon" />

            <div class="navbar-item__sitename">Chartyourtrade</div>
          </router-link>

          <a
            @click="toggleNav()"
            role="button"
            class="navbar-burger"
            aria-label="menu"
            aria-expanded="false"
            data-target="navbarBasicExample"
            :class="{ 'is-active': isToggleNav }"
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div class="navbar-menu" :class="{ 'is-active': isToggleNav }">
          <div class="navbar-end">
            <router-link
              :to="{ name: 'portfolio' }"
              v-if="user.loggedIn"
              class="navbar-item"
              >Портфели</router-link
            >
            <router-link
              :to="{ name: 'dividends' }"
              v-if="user.loggedIn"
              class="navbar-item"
              >Дивиденды</router-link
            >
            <div class="navbar-item has-dropdown is-hoverable">
              <a class="navbar-link">Инструменты</a>

              <div class="navbar-dropdown">
                <router-link
                  :to="{ name: 'middle-price-calculator' }"
                  class="navbar-item"
                  >Калькулятор усреднения</router-link
                ><router-link
                  :to="{ name: 'sell-middle-price-calculator' }"
                  class="navbar-item"
                  >Калькулятор усреднения продаж</router-link
                >
              </div>
            </div>
            <div class="navbar-item" v-if="!user.loggedIn">
              <div class="buttons">
                <router-link to="/registration" class="button is-primary"
                  ><strong>Регистрация</strong></router-link
                >
                <router-link to="/login" class="button is-light"
                  >Войти</router-link
                >
              </div>
            </div>
            <div class="navbar-item has-dropdown is-hoverable" v-else>
              <div class="navbar-item">
                <figure class="image is-64x64 navbar__profile__avatar">
                  <img src="https://bulma.io/images/placeholders/64x64.png" />
                </figure>
                <div class="navbar__profile__name">
                  {{ user.credentials.email }}
                </div>
              </div>

              <div class="navbar-dropdown">
                <router-link :to="{ name: 'profile' }" class="navbar-item">
                  Профиль
                </router-link>
                <hr class="navbar-divider" />
                <button
                  class="navbar-item button is-white navbar__logout"
                  @click="logout"
                >
                  Выйти
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  </header>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";

export default Vue.extend({
  name: "Header",

  data() {
    return {
      isToggleNav: false as boolean,
    };
  },

  computed: {
    ...mapState(["user"]),
  },

  methods: {
    toggleNav(): void {
      this.isToggleNav = !this.isToggleNav;
    },

    logout(): void {
      this.$store.dispatch("user/LOGOUT");
      this.$router.push({ path: "/" }).catch(() => {});
    },
  },
});
</script>

<style scoped>
header.header {
  padding-top: 20px;
  margin-bottom: 40px;
}
.navbar-brand__icon {
  margin-right: 10px;
}
.navbar-item__sitename {
  color: #333;
}
.navbar__profile__avatar {
  display: inline-block;
  vertical-align: middle;
}
.navbar__profile__avatar img {
  max-height: initial;
}
.navbar__profile__name {
  margin-left: 15px;
  display: inline-block;
  vertical-align: middle;
}

/* hide dropdown after click */
@media screen and (min-width: 1025px) {
  .navbar-item.is-hoverable:hover .navbar-dropdown {
    display: block !important;
  }
  .navbar-item.is-hoverable:focus-within .navbar-dropdown {
    display: none;
  }
}

.navbar__logout {
  display: block;
  color: #4a4a4a !important;
  width: 100%;
  font-size: 0.875rem;
  text-align: left;
}
.navbar__logout:hover {
  background-color: whitesmoke !important;
  color: #0a0a0a !important;
}
</style>
