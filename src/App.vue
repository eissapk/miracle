<template>
  <router-view />
  <LoaderView v-if="isLoading" />
</template>

<script>
import LoaderView from "./components/LoaderView.vue";
import handlePages from "./services/fetch";
export default {
  components: { LoaderView },
  data() {
    return {
      isLoading: true,
    };
  },
  beforeCreate() {
    handlePages()
      .then((pages) => {
        window.pages = pages;
        document.body.classList.remove("overflow");
        this.isLoading = false;
      })
      .catch(console.error);
  },
};
</script>

<style lang="scss">
@import "./style/index.scss";
</style>