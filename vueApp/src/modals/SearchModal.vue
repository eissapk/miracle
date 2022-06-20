<template>
  <ModalSlot name="search">
    <SearchEngine></SearchEngine>
  </ModalSlot>
</template>

<script>
  import ModalSlot from "../components/modalSlot.vue";
  import SearchEngine from "../components/searchEngine.vue";
  export default {
    components: { ModalSlot, SearchEngine },
    data() {
      return {
      };
    },
    mounted() {
      // if (window.verses) {
      //   console.log(verses);
      //   this.error.status = false;
      // } else {
      //   this.error.text = "حدث خطأ يرجى المحاولة مرة اخرى او العودة للصفحة الرئيسية";
      //   this.error.status = true;
      //   console.warn("window.verses is NOT defined");
      // }
    },
  };
</script>
