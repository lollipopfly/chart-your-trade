<template>
  <div class="container has-text-centered">
    <h1 class="not__found__title">404</h1>
    <p class="not__found__text">Упс, странице не найдена!</p>
  </div>
</template>

<style>
.not__found__title {
  font-size: 230px;
  font-weight: 700;
  line-height: 240px;
  margin-bottom: 30px;
}
.not__found__text {
  font-size: 20px;
}
@media (max-width: 767px) {
  .not__found__title {
    margin-bottom: 20px;
    font-size: 150px;
    line-height: 160px;
  }
}
</style>
