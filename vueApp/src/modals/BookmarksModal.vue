<template>
  <ModalSlot name="bookmark">
    <h1>surah</h1>
    <div class="pages" v-for="(bookmark, index) of bookmarks" :key="index">
      <p>صفحة: {{ bookmark.page }}</p>
      <p>سُورَةُ: {{ bookmark.name }}</p>
    </div>
    <h1>verse</h1>
    <div class="verses" v-for="(obj, index) of highlightedVerses" :key="index">
      <p>{{ obj.text }}</p>
      <p>{{ obj.page }}</p>
      <p>{{ obj.name }}</p>
    </div>
  </ModalSlot>
</template>

<script>
  import ModalSlot from "../components/modalSlot.vue";
  export default {
    components: { ModalSlot },
    data() {
      return {
        bookmarks: [],
        highlightedVerses: [],
      };
    },
    beforeMount() {
      this.bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
      this.highlightedVerses = JSON.parse(localStorage.getItem("highlightedVerses")) || [];
    },
  };
</script>

<style lang="scss" scoped>
  .verses {
    font-family: "Kitab-Regular2";

    outline: 1px solid red;
  }
  .pages {
    font-family: "Kitab-Regular2";

    outline: 1px solid blue;
  }
</style>
