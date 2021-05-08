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
            role="button"
            class="navbar-burger"
            aria-label="menu"
            aria-expanded="false"
            data-target="navbarBasicExample"
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div id="navbarBasicExample" class="navbar-menu">
          <div class="navbar-end">
            <div class="navbar-item has-dropdown is-hoverable">
              <a class="navbar-link">Инструменты</a>

              <div class="navbar-dropdown">
                <router-link to="middle-price-calculator" class="navbar-item"
                  >Калькулятор усреднения</router-link
                >
                <a class="navbar-item"> Калькулятор 2 </a>
                <hr class="navbar-divider" />
                <a class="navbar-item"> Report an issue </a>
              </div>
            </div>
            <div class="navbar-item" v-if="!this.user.loggedIn">
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
                  {{ this.user.credentials.email }}
                </div>
              </div>

              <div class="navbar-dropdown">
                <a class="navbar-item">
                  Профиль
                </a>
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

<script>
import { mapState } from "vuex";

export default {
  name: "Header",

  computed: {
    ...mapState(["user"]),
  },

  methods: {
    logout() {
      this.$store.dispatch("user/LOGOUT");
      this.$router.push({ path: "/" }).catch(() => {});
    },
  },
};
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
.navbar__profile__avatar img {
  max-height: initial;
}
.navbar__profile__name {
  margin-left: 15px;
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
