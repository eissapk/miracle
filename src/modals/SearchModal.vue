<template>
  <div class="searchModal modal">
    <div class="container">
      <button class="closeModalBtn" @click="hideModal()" v-html="closeIcon"></button>

      <nav>
        <ul>
          <li :class="{ active: tab === 'surah' }" @click="tab = 'surah'"><a>سورة</a></li>
          <li :class="{ active: tab === 'verse' }" @click="tab = 'verse'"><a>اية</a></li>
          <li :class="{ active: tab === 'verseInSurah' }" @click="tab = 'verseInSurah'"><a>اية فى سورة</a></li>
          <li :class="{ active: tab === 'page' }" @click="tab = 'page'"><a>صفحة</a></li>
          <li :class="{ active: tab === 'part' }" @click="tab = 'part'"><a>جزء</a></li>
        </ul>
      </nav>
      <!-- <div v-if="error.status">
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
      </div> -->
    </div>
  </div>
</template>

<script>
  import icons from "../services/icons";
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
        closeIcon: icons.close,
        tab: "surah",
      };
    },
    mounted() {
      if (window.verses) {
        console.log(verses);
        this.error.status = false;
      } else {
        this.error.text = "حدث خطأ يرجى المحاولة مرة اخرى او العودة للصفحة الرئيسية";
        this.error.status = true;
        console.warn("window.verses is NOT defined");
      }
      document.body.classList.add("overflow");
    },
    methods: {
      search(str, limit = 30) {
        str = str.replace(/ى/g, "ي"); // because all reltaive letters in ref.json are "ي"
        if (window.verses) {
          const resultsArr = window.verses.filter(obj => {
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

<style lang="scss">
  .searchModal {
    .closeModalBtn {
      width: 40px;
      height: 40px;
      border: 0;
      outline: 0;
      background: transparent;
      cursor: pointer;
      border-radius: 3px;
      float: left;
      margin-top: -10px;
      margin-left: -10px;
      svg {
        pointer-events: none;
        width: 100%;
        height: 100%;
        color: #666;
      }
    }
    nav {
      margin-top: 30px;
      padding: 0px 0 0px;
      line-height: 40px;
      border-bottom: 1px solid #ccc;
      ul {
        margin: 0;
        padding: 0;
        list-style-type: none;
        display: flex;
        li {
          position: relative;
          padding: 0 20px;
          cursor: pointer;
          a {
            pointer-events: none;
            text-decoration: none;
            display: block;
            font-size: 14px;
            color: #666;
            font-family: "Tajawal", Helvetica, Arial, sans-serif;
          }
          &.active {
            &:after {
              position: absolute;
              content: "";
              width: 100%;
              height: 2px;
              left: 0;
              bottom: -1px;
              background: #2f70ec;
            }
            a {
              color: #2f70ec;
              font-weight: bold;
            }
          }
        }
      }
    }
  }
</style>
