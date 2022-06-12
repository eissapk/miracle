<template>
  <router-view />

  <!-- modals -->
  <SearchModal v-if="modal === 'search'" />
  <BookmarksModal v-if="modal === 'bookmarks'" />
  <TransModal v-if="modal === 'trans'" />
  <ExplanationModal v-if="modal === 'explanation'" />

  <LoaderView v-if="isLoading" />
</template>

<script>
import LoaderView from "./components/LoaderView.vue";
import SearchModal from "./modals/SearchModal.vue";
import BookmarksModal from "./modals/BookmarksModal.vue";
import TransModal from "./modals/TransModal.vue";
import ExplanationModal from "./modals/ExplanationModal.vue";
import handlePages from "./services/fetch";
export default {
  components: {
    LoaderView,
    SearchModal,
    BookmarksModal,
    TransModal,
    ExplanationModal,
  },
  data() {
    return {
      isLoading: true,
      modal: "",
    };
  },
  created() {
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