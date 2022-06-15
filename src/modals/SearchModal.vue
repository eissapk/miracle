<template>
  <div class="searchModal modal">
    <div class="container">
      <button @click="hideModal()">x</button>
      <div v-if="error.status">
        {{ error.text }}
      </div>
      <div v-else style="height: calc(100% - 80px);">
        <input type="text" v-model.trim="query" @keyup="handleEngine" />
        <p>{{length}}</p>
        <ul v-if="resultsArr.length" style="overflow: auto; height: 100%;">
          <li v-for="(obj, index) of resultsArr" :key="index" style="font-family: 'Kitab-Regular2'">
            {{ obj.text }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      query: "",
      error: {
        status: false,
        text: "",
      },
      resultsArr: [],
      length: 0,
    };
  },
  mounted() {
    if (window.verses) {
      console.log(verses);
      this.error.status = false;
    } else {
      this.error.text =
        "حدث خطأ يرجى المحاولة مرة اخرى او العودة للصفحة الرئيسية";
      this.error.status = true;
      console.warn("window.verses is NOT defined");
    }
    document.body.classList.add("overflow");
  },
  methods: {
    search(str, limit = 30) {
      str = str.replace(/ى/g, "ي"); // because all reltaive letters in ref.json are "ي"
      if (window.verses) {
        const resultsArr = window.verses.filter((obj) => {
          return this.$filters.normalize(obj.text).trim().includes(str);
        });
        const firstChunck = resultsArr.slice(0, limit);
        return { length: resultsArr.length, resultsArr: firstChunck };
      }
    },
    handleEngine(e) {
      if (e.keyCode === 13) {
        const { length, resultsArr } = this.search(this.query);
        console.log(this.query);
        console.log(length, resultsArr);
        this.resultsArr = resultsArr;
        this.length = length;
      }
    },
    hideModal() {
      this.$el.classList.add("hide");
      setTimeout(() => {
        document.body.classList.remove("overflow");
        this.$el.classList.remove("hide");
        this.$parent.modal = "";
      }, 500);
    },
  },
};
</script>