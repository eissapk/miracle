<template>
  <ModalSlot name="bookmark">bookmark</ModalSlot>
  <!-- <div class="bookmarksModal modal">
    <div class="container">
      <button @click="hideModal()">close</button>
      <p>bookmarks</p>

      <div
        class="bookmarks"
        v-for="(bookmark, index) of bookmarks"
        :key="index"
      >
        <p>صفحة: {{ bookmark.page }}</p>
        <p>سُورَةُ: {{ bookmark.name }}</p>
      </div>
    </div>
  </div> -->
</template>

<script>
  import ModalSlot from "../components/modalSlot.vue";
  export default {
    components: { ModalSlot },
    data() {
      return {
        bookmarks: [],
      };
    },
    beforeMount() {
      this.bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
    },
  };
</script>
