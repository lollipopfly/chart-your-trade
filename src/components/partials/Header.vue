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
                <a class="navbar-item"> Калькулятор 1 </a>
                <a class="navbar-item"> Калькулятор 2 </a>
                <hr class="navbar-divider" />
                <a class="navbar-item"> Report an issue </a>
              </div>
            </div>
            <div class="navbar-item">
              <div class="buttons">
                <router-link to="/registration" class="button is-primary"
                  ><strong>Регистрация</strong></router-link
                >
                <router-link to="/login" class="button is-light"
                  >Войти</router-link
                >
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  </header>
</template>

<script>
export default {
  name: "Header",
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
</style>
