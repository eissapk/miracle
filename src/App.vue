<template>
  <router-view />

  <!-- modals -->
  <SearchModal v-if="modal.name === 'search'" />
  <BookmarksModal v-if="modal.name === 'bookmarks'" />
  <TransModal v-if="modal.name === 'trans'" />
  <ExplanationModal v-if="modal.name === 'explanation'" />

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
      modal: {
        name: "",
        data: null,
      },
      audioInstance: null
    };
  },
  created() {
    handlePages()
      .then(({ pages, verses }) => {
        window.pages = pages;
        window.verses = verses;
        document.body.classList.remove("overflow");
        this.isLoading = false;
      })
      .catch(console.error);
  },
  mounted() {
    this.audioInstance = new Audio();
  }
};
</script>

<style lang="scss">
@import "./style/index.scss";
</style>