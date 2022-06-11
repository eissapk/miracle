<template>
  <div v-if="currentPage">
    <button @click="next()">next</button>
    <button @click="prev()">prev</button>

    {{ pageNum }}
    <div class="page">
      <span v-for="(obj, index) of currentPage" :key="index">
        {{ obj.text }} ({{ index + 1 }})
      </span>
    </div>
  </div>
</template>

<script>
import handlePages from "../services/fetch";
export default {
  data() {
    return {
      pageNum: null,
      currentPage: null,
    };
  },
  beforeCreate() {
    // const page = +this.$route.params.page;
    // this.pageNum = page;
    // console.log({ page });
    // if (window.pages) {
    // this.pages = window.pages;
    // console.log(window.pages);
    // this.currentPage = window.pages[page];
    // console.log(this.currentPage);
    // } else {
    // console.warn("pages NOT defined");
    // handlePages()
    //   .then((pages) => (this.pages = pages))
    //   .catch(console.error);
    // }
  },
  mounted() {
    this.pageNum = +this.$route.params.page;
    console.log({ pageNum: this.pageNum });
    if (window.pages) {
      this.currentPage = window.pages[this.pageNum];
      console.log(this.currentPage);
      localStorage.setItem("lastRead", JSON.stringify(this.pageNum));
    }
  },
  methods: {
    next() {
      if (this.pageNum < 604) this.pageNum++;
      else this.pageNum = 604;
      this.currentPage = window.pages[this.pageNum];
      localStorage.setItem("lastRead", JSON.stringify(this.pageNum));
    },
    prev() {
      if (this.pageNum > 1 && this.pageNum <= 604) this.pageNum--;
      else this.pageNum = 1;
      this.currentPage = window.pages[this.pageNum];
      localStorage.setItem("lastRead", JSON.stringify(this.pageNum));
    },
  },
};
</script>

<style lang="scss" scoped>
.page {
  font-family: "Kitab-Regular" !important;
  * {
    font-family: "Kitab-Regular" !important;
  }
  span {
    font-size: 25px;
  }
}
</style>