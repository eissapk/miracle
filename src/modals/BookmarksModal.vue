<template>
  <div class="bookmarksModal modal">
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      bookmarks: [],
    };
  },
  beforeMount() {
    this.bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
  },
  mounted() {
    document.body.classList.add("overflow");
  },
  methods: {
    hideModal() {
      this.$el.classList.add("hide");
      setTimeout(() => {
        document.body.classList.remove("overflow");
        this.$el.classList.remove("hide");
        this.$parent.modal = "";
      }, 400);
    },
  },
};
</script>

<style lang="scss">
.bookmarksModal {
  .bookmarks {
    outline: 1px solid red;
  }
}
</style>