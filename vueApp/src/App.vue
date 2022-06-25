<template>
  <router-view />

  <!-- modals -->
  <SearchModal v-if="modal.name === 'search'" />
  <BookmarksModal v-if="modal.name === 'bookmarks'" />
  <TransModal v-if="modal.name === 'trans'" />
  <ExplanationModal v-if="modal.name === 'explanation'" />
  <Completion v-if="modal.name === 'completion'" />
  <Doaa v-if="modal.name === 'doaa'" />

  <LoaderView v-if="isLoading" />
</template>

<script>
  import LoaderView from "./components/LoaderView.vue";
  import SearchModal from "./modals/SearchModal.vue";
  import BookmarksModal from "./modals/BookmarksModal.vue";
  import Completion from "./modals/Completion.vue";
  import TransModal from "./modals/TransModal.vue";
  import Doaa from "./modals/Doaa.vue";
  import ExplanationModal from "./modals/ExplanationModal.vue";
  import handlePages from "./services/fetch";
  export default {
    components: {
      LoaderView,
      SearchModal,
      BookmarksModal,
      TransModal,
      ExplanationModal,
      Completion,
      Doaa
    },
    data() {
      return {
        isLoading: true,
        modal: {
          name: "",
          data: null,
        },
        audioInstance: null,
        readViewEnabled: false,
        currentVerse: null,
        highlightCurrentVerse: false,
      };
    },
    created() {
      handlePages()
        .then(({ pages, verses, surahs }) => {
          window.pages = pages;
          window.surahs = surahs;
          window.verses = verses;
          document.body.classList.remove("overflow");
          this.isLoading = false;
        })
        .catch(console.error);
    },
    mounted() {
      this.audioInstance = new Audio();
      document.body.ontouchstart = function (e) {
        e.preventDefault();
      };
    },
  };
</script>

<style lang="scss">
  @import "./style/index.scss";
</style>
