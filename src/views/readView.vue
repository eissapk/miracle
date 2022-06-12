<template>
  <div class="readView">
    <NotFound v-if="isLoading" />

    <div class="container" v-if="!isLoading && currentPage">
      <div class="page">
        <!-- bar -->
        <div class="bar">
          <span class="name" v-text="currentPage[0].name"></span>
          <span class="juz" v-text="$filters.juz(currentPage[0].juz)"></span>
        </div>

        <!-- options -->
        <div class="options">
          <a @click="showModal('search')" v-html="solid_search"></a>
          <a v-html="solid_bookmark" @click="bookmarkPage(currentPage[0])"></a>
        </div>
        <!-- content -->
        <template v-for="(obj, index) of currentPage" :key="index">
          <!-- header -->
          <div class="head" v-if="obj.localVerse === 1">
            <p class="surah" v-text="$filters.arNum(obj.surah)"></p>
            <p class="name" v-text="'سُورَةُ ' + obj.name"></p>
            <p class="other">
              <span
                class="verses"
                v-text="'أياتها ' + $filters.arNum(obj.verses)"
              ></span>
              -
              <span class="type" v-text="$filters.surahType(obj.type)"></span>
            </p>
          </div>

          <!-- بسملة -->
          <div
            class="start"
            v-if="obj.localVerse === 1 && ![1, 9].includes(obj.surah)"
          >
            {{ start }}
          </div>

          <!-- verses -->
          <span class="verse" @click="showVerseOpt(obj)"
            ><span
              class="text"
              v-html="$filters.highlight(obj.text, godArr, 'god')"
            ></span
            ><span class="num" v-text="$filters.arNum(obj.localVerse)"></span
          ></span>
        </template>

        <!-- page number -->
        <div class="pageNum">
          <span v-text="$filters.arNum(pageNum)"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NotFound from "../components/NotFound.vue";
import solid_bookmark from "olum-icons/dist/fa/solid_bookmark";
import solid_search from "olum-icons/dist/fa/solid_search";
export default {
  components: { NotFound },
  data() {
    return {
      solid_bookmark,
      solid_search,
      pageNum: null,
      currentPage: null,
      isLoading: true,
      interval: null,
      start: "بِسۡمِ ٱللَّهِ ٱلرَّحۡمَـٰنِ ٱلرَّحِیمِ",
      godArr: [
        "هو",
        "لله",
        "الله",
        "رب",
        "ربهم",
        "ربكم",
        "ربك",
        "ربه",
        "ربنا",
        "لرب",
        "ربي",
        "ربها",
        "لربك",
        "ربكما",
        "ربهما",
        "ربها",
      ],
    };
  },
  created() {
    this.pageNum = +this.$route.params.page;
    console.log({ pageNum: this.pageNum });

    function getCurrentPage() {
      this.currentPage = window.pages[this.pageNum];
      console.log("currentPage", this.currentPage);

      if (this.currentPage) {
        const obj = this.getLastReadObj(this.currentPage);
        localStorage.setItem("lastRead", JSON.stringify(obj));
        this.isLoading = false;
      }
    }

    if (window.pages) {
      getCurrentPage.bind(this)();
    } else {
      console.warn("window.pages is NOT defined!");
      this.interval = setInterval(() => {
        console.log("interval");
        if (window.pages) {
          clearInterval(this.interval);
          getCurrentPage.bind(this)();
        }
      }, 1);

      // fall back if window.pages not defined then kill interval after 5s
      setTimeout(() => {
        if (this.interval) clearInterval(this.interval);
      }, 5000);
    }
  },
  mounted() {
    document.body.addEventListener("keydown", (e) => {
      if (e.keyCode === 39) this.next();
      else if (e.keyCode === 37) this.prev();
    });
  },
  unmounted() {
    if (this.interval) clearInterval(this.interval);
  },
  methods: {
    getLastReadObj(arr) {
      const firstObj = arr[0];
      const obj = {
        juz: firstObj.juz,
        page: firstObj.page,
        name: firstObj.name,
        type: firstObj.type,
        surah: firstObj.surah,
        verses: firstObj.verses,
      };
      return obj;
    },
    next() {
      if (this.pageNum < 604) this.pageNum++;
      else return (this.pageNum = 604);
      this.currentPage = window.pages[this.pageNum];
      console.log(this.currentPage);
      const obj = this.getLastReadObj(this.currentPage);
      localStorage.setItem("lastRead", JSON.stringify(obj));
    },
    prev() {
      if (this.pageNum > 1 && this.pageNum <= 604) this.pageNum--;
      else return (this.pageNum = 1);
      this.currentPage = window.pages[this.pageNum];
      console.log(this.currentPage);
      const obj = this.getLastReadObj(this.currentPage);
      localStorage.setItem("lastRead", JSON.stringify(obj));
    },
    showModal(name) {
      this.$parent.$parent.modal = name;
    },
    showVerseOpt(obj) {
      console.log(obj);
    },
    bookmarkPage(arg) {
      const obj = {
        juz: arg.juz,
        page: arg.page,
        name: arg.name,
        type: arg.type,
        surah: arg.surah,
        verses: arg.verses,
      };

      const bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
      const hasSamePage = bookmarks.find((item) => item.page === obj.page);
      if (!hasSamePage) {
        bookmarks.push(obj);
        localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
      }
    },
  },
};
</script>

<style lang="scss">
.readView {
  .container {
    .page {
      .bar {
        user-select: none;
        overflow: hidden;
        margin-bottom: 20px;
        span {
          font-size: 12px;
          font-weight: bold;
          color: #666;
          line-height: 35px;
          border-bottom: 2px solid #6a11cb;
        }
        .name {
          float: left;
          font-family: "Kitab-Regular";
          font-size: 15px;
        }
        .juz {
          float: right;
        }
      }

      .options {
        overflow: hidden;
        margin-bottom: 10px;
        padding: 5px 0;
        a {
          cursor: pointer;
          display: block;
          float: right;
          width: 40px;
          height: 40px;
          background: linear-gradient(90deg, #6a11cb, #2f70ec);
          margin: 0px 5px;
          position: relative;
          border-radius: 50%;
          box-shadow: 0 0 3px 1px rgba(0, 0, 0, 15%);

          svg {
            height: 20px;
            fill: white;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
          }
          &:active {
            transform: perspective(1px) translateZ(-0.04px);
            transition: 200ms cubic-bezier(0.12, 0.8, 0.32, 1);
          }
        }
      }

      .head {
        color: white;
        background: linear-gradient(90deg, #6a11cb, #2f70ec);
        font-size: 18px;
        text-align: center;
        margin-bottom: 10px;
        border-radius: 50px;
        padding: 20px 0;
        user-select: none;
        max-width: 200px;
        margin: 20px auto;
        .surah {
          font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
          font-size: 14px;
          width: 30px;
          height: 30px;
          line-height: 30px;
          border-radius: 50%;
          margin: 0 auto;
          margin-bottom: 10px;
          background: white;
          color: #666;
        }
        .name {
          font-weight: bold;
          font-size: 20px;
          font-family: "Kitab-Regular";
          margin: 0;
          margin-bottom: 5px;
        }
        .other {
          margin: 0;
          .type {
          }
          .verses {
          }
        }
      }

      .start {
        text-align: center;
        font-size: 25px;
        margin: 10px 0;
        font-family: "Kitab-Regular";
        background-image: linear-gradient(to left, #ed69f4, #3c97ee);
        -webkit-background-clip: text;
        color: transparent;
        background-size: 5% auto;
      }

      .verse {
        cursor: pointer;
        padding: 20px 5px 7px 0px;
        .text {
          font-size: 25px;
          font-family: "Kitab-Regular";
          color: #333;
          pointer-events: none;
        }
        .num {
          pointer-events: none;
          font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
          width: 35px;
          height: 35px;
          line-height: 35px;
          border-radius: 50%;
          background: #5fd068;
          display: inline-block;
          font-size: 15px;
          text-align: center;
          color: white;
          margin: 0 8px;
          user-select: none;
          box-shadow: 0 0 3px 1px rgba(0, 0, 0, 15%);
        }

        &:hover {
          background: #f7f7f7;
          border-radius: 5px;
          transition: background 0.1s ease-in-out;
          .text {
            transition: all 0.1s ease-in-out;
            background-image: linear-gradient(to left, #ed69f4, #3c97ee);
            -webkit-background-clip: text;
            color: transparent;
            background-size: 5% auto;

            .god,
            .hizb {
              color: transparent;
            }
          }
        }
      }

      .pageNum {
        margin-top: 25px;
        user-select: none;

        span {
          font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
          font-size: 14px;
          font-weight: bold;
          width: 40px;
          height: 40px;
          line-height: 40px;
          border-radius: 50%;
          background: #f94c66;
          text-align: center;
          color: white;
          margin: 0 auto;
          display: block;
          box-shadow: 0 0 3px 1px rgba(0, 0, 0, 15%);
        }
      }
    }
  }
}
</style>