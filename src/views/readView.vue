<template>
  <div class="readView">
    <NotFound v-if="isLoading" />
    <NotifyModal v-if="!isLoading && notifyShown" :class="[notifyShown ? notifyClass : '']" :desc="notifyDesc" />

    <OptionsRect v-show="!isLoading && optionsRectShown" @update="handlePlaying(e, $event)" @hide="optionsRectShown = false" @textCopied="textCopied()" :options="optionsData" :audio="audioInstance" />

    <div class="container" v-if="!isLoading && currentPage">
      <div class="page">
        <!-- bar -->
        <div class="bar">
          <span class="name" v-text="currentPage[0].name"></span>
          <span class="juz" v-text="$filters.juz(currentPage[0].juz)"></span>
        </div>

        <!-- options -->
        <div class="options">
          <button @click="showModal('search')" v-html="searchIcon"></button>
          <button :disabled="isBookmarkDisabled" :class="[isBookmarkDisabled ? 'disabled' : '']" v-html="bookmarkIcon" @click="bookmarkPage(currentPage[0])"></button>
          <template v-if="isInitialPlaying">
            <button v-if="isPlaying" v-html="pauseIcon" @click="pauseReciting()"></button>
            <button v-else v-html="playIcon" @click="resumeReciting()"></button>
          </template>
          <label v-if="isInitialPlaying" class="autoReciting">
            <input type="checkbox" class="o-switch-btn" @click="auto" />
            تلقائي
          </label>
        </div>
        <!-- content -->
        <template v-for="(obj, index) of currentPage" :key="index">
          <!-- header -->
          <div class="head" v-if="obj.localVerse === 1">
            <p class="surah" v-text="$filters.arNum(obj.surah)"></p>
            <p class="name" v-text="'سُورَةُ ' + obj.name"></p>
            <p class="other">
              <span class="verses" v-text="'أياتها ' + $filters.arNum(obj.verses)"></span>
              -
              <span class="type" v-text="$filters.surahType(obj.type)"></span>
            </p>
          </div>

          <!-- بسملة -->
          <div class="start" v-if="obj.localVerse === 1 && ![1, 9].includes(obj.surah)">
            {{ start }}
          </div>

          <!-- verses -->
          <span :class="[isHighlightedVerse(obj) ? isHighlightedVerse(obj) : '', 'verse']" @click="showVerseOpt(obj, $event)">
            <span class="text" v-html="$filters.highlight(obj.text, godArr, 'god')"></span>
            <span class="num" v-text="$filters.arNum(obj.localVerse)"></span>
          </span>
        </template>
        <!-- page number -->
        <div class="pageFooter">
          <div class="sound">
            <label>القارئ</label>
            <div class="o-select rtl">
              <select v-model="optionsData.reciter">
                <option value="mahermuaiqly">ماهر المعيقلى</option>
                <option value="ahmedajamy">احمد العجمى</option>
                <option value="husary">الحصرى</option>
              </select>
            </div>
          </div>

          <div class="pageNum" v-text="$filters.arNum(pageNum)"></div>

          <div class="explanation">
            <label>التفسير</label>
            <div class="o-select rtl">
              <select v-model="optionsData.explainer">
                <option value="muyassar">الميسر</option>
                <option value="jalalayn">الجلالين</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import NotFound from "../components/NotFound.vue";
  import NotifyModal from "../modals/NotifyModal.vue";
  import OptionsRect from "../modals/OptionsRect.vue";
  import icons from "../services/icons";

  export default {
    components: { NotFound, NotifyModal, OptionsRect },
    data() {
      return {
        optionsData: {
          coords: {
            top: 0,
            left: 0,
            right: 0,
            width: 0,
            elm: null,
          },
          obj: null,
          reciter: "mahermuaiqly",
          explainer: "muyassar",
          translator: "ahmedraza",
        },
        isAuto: false,
        audioInstance: null,
        isPlaying: false,
        isInitialPlaying: null,
        optionsRectShown: false,
        notifyDesc: "",
        notifyClass: "",
        notifyShown: false,
        isBookmarkDisabled: false,
        bookmarkIcon: icons.bookmark,
        searchIcon: icons.search,
        playIcon: icons.playSolid,
        pauseIcon: icons.pause,
        pageNum: null,
        currentPage: null,
        isLoading: true,
        interval: null,
        start: "بِسۡمِ ٱللَّهِ ٱلرَّحۡمَـٰنِ ٱلرَّحِیمِ",
        godArr: ["اله", "واحد", "هو", "لله", "الله", "رب", "ربهم", "ربكم", "ربك", "ربه", "ربنا", "لرب", "ربي", "ربها", "لربك", "ربكما", "ربهما", "ربها"],
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
    watch: {
      "optionsData.reciter": function () {
        this.setOptionsData();
      },
      "optionsData.explainer": function () {
        this.setOptionsData();
      },
      "optionsData.translator": function () {
        this.setOptionsData();
      },
    },
    beforeMount() {
      const optionsData = JSON.parse(localStorage.getItem("optionsData")) || { reciter: "mahermuaiqly", explainer: "muyassar", translator: "ahmedraza" };
      this.optionsData.reciter = optionsData.reciter;
      this.optionsData.explainer = optionsData.explainer;
      this.optionsData.translator = optionsData.translator;
    },
    mounted() {
      this.audioInstance = this.$parent.$parent.audioInstance;
      document.body.addEventListener("keydown", e => {
        if (e.keyCode === 39) this.next();
        else if (e.keyCode === 37) this.prev();
      });
    },
    unmounted() {
      if (this.interval) clearInterval(this.interval);
    },
    methods: {
      auto(e) {
        this.isAuto = e.target.checked;
        console.log({ auto: this.isAuto });
      },
      setOptionsData() {
        const obj = { reciter: this.optionsData.reciter, explainer: this.optionsData.explainer, translator: this.optionsData.translator };
        localStorage.setItem("optionsData", JSON.stringify(obj));
      },
      isHighlightedVerse(obj) {
        const highlightedVersesArr = JSON.parse(localStorage.getItem("highlightedVerses")) || [];
        const verseObj = highlightedVersesArr.find(item => obj.globalVerse === item.globalVerse);
        if (verseObj) return verseObj.color;
        return null;
      },
      textCopied() {
        this.notifyShown = true;
        this.notifyDesc = "تم النسخ";
        setTimeout(() => {
          this.notifyShown = false;
          this.notifyClass = "";
        }, 1000);
      },
      handlePlaying(e, obj) {
        this.isPlaying = obj.isPlaying;
        this.isInitialPlaying = obj.isInitialPlaying;
      },
      pauseReciting() {
        this.audioInstance.pause();
        this.isPlaying = false;
      },
      resumeReciting() {
        this.audioInstance.play();
        this.isPlaying = true;
      },
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
      next(num) {
        if (!num) {
          if (this.pageNum < 604) this.pageNum++;
          else return (this.pageNum = 604);
          this.currentPage = window.pages[this.pageNum];
        }
        location.hash = "#read/" + (num ? num : this.pageNum); // update hash
        this.optionsRectShown = false;
        console.log(this.currentPage);
        const obj = this.getLastReadObj(this.currentPage);
        localStorage.setItem("lastRead", JSON.stringify(obj));
      },
      prev() {
        if (this.pageNum > 1 && this.pageNum <= 604) this.pageNum--;
        else return (this.pageNum = 1);
        this.currentPage = window.pages[this.pageNum];
        location.hash = "#read/" + this.pageNum; // update hash
        this.optionsRectShown = false;
        console.log(this.currentPage);
        const obj = this.getLastReadObj(this.currentPage);
        localStorage.setItem("lastRead", JSON.stringify(obj));
      },
      showModal(name) {
        this.$parent.$parent.modal = { name };
      },
      showVerseOpt(obj, e) {
        // reset verses
        const verses = document.querySelectorAll(".page .verse");
        verses.forEach(verseNode => verseNode.classList.remove("selected"));
        // select current verse
        e.target.classList.add("selected");
        // update info
        this.optionsData.coords.top = e.target.getBoundingClientRect().top;
        this.optionsData.coords.left = e.target.getBoundingClientRect().left;
        this.optionsData.coords.right = e.target.getBoundingClientRect().right;
        this.optionsData.coords.width = e.target.getBoundingClientRect().width;
        this.optionsData.coords.elm = e.target;
        window.onscroll = () => {
          this.optionsData.coords.top = e.target.getBoundingClientRect().top;
        };
        this.optionsData.obj = obj;
        // show rect
        this.optionsRectShown = true;
        console.log(this.optionsData);
      },
      bookmarkPage(arg) {
        this.isBookmarkDisabled = true;
        const obj = {
          juz: arg.juz,
          page: arg.page,
          name: arg.name,
          type: arg.type,
          surah: arg.surah,
          verses: arg.verses,
        };
        console.log(obj);

        const bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
        const hasSamePage = bookmarks.find(item => item.page === obj.page);
        if (!hasSamePage) {
          bookmarks.push(obj);
          localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
          this.notifyClass = "";
          this.notifyDesc = "تمت الاضافة للمفضلة";
          this.notifyShown = true;
        } else {
          this.notifyClass = "alert";
          this.notifyDesc = "هذه الصفحة مضافة بالفعل";
          this.notifyShown = true;
        }

        setTimeout(() => {
          this.notifyShown = false;
          this.notifyDesc = "";
          this.isBookmarkDisabled = false;
        }, 3000);
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
          button {
            border: none;
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
              pointer-events: none;
              height: 20px;
              color: white;
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
          .autoReciting {
            display: inline-block;
            height: 40px;
            line-height: 45px;
            font-family: "Tajawal", Helvetica, Arial, sans-serif;
            font-size: 12px;
            font-weight: bold;
            color: #666;
            user-select: none;
            input {
              transform: scale(1.3);
              margin: 10px 10px 0 15px;
              float: right;
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
          font-size: 40px;
          letter-spacing: initial;
          margin: 10px 0;
          font-family: "almushaf", serif;
          background: -webkit-linear-gradient(315deg, #42d392 25%, #647eff);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          user-select: none;
        }

        .verse {
          cursor: pointer;
          padding: 16px 7px 11px 0px;
          .text {
            font-size: 25px;
            // font-family: "Kitab-Regular";
            font-family: "Kitab-Regular2";
            letter-spacing: initial;
            color: #333;
            pointer-events: none;
            user-select: none;
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

          @mixin selected {
            background: #f7f7f7;
            border-radius: 5px;
            transition: background 0.1s ease-in-out;
            .text {
              transition: all 0.1s ease-in-out;
              background: -webkit-linear-gradient(315deg, #42d392 25%, #647eff);
              background-clip: text;
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              color: transparent;
              .god,
              .hizb {
                -webkit-text-fill-color: transparent;
                color: transparent;
              }
            }
          }

          &.selected {
            @include selected;
          }

          &:hover {
            @include selected;
          }

          &.orange {
            background: #ff8214 !important;
          }
          &.purple {
            background: #8b0efe !important;
          }
          &.blue {
            background: #0671ff !important;
          }

          &.orange,
          &.purple,
          &.blue {
            border-radius: 5px;
            .text {
              background: transparent !important;
              color: white !important;
              -webkit-text-fill-color: initial;
              background-clip: initial;
              -webkit-background-clip: initial;
              .god,
              .hizb {
                color: white !important;
                -webkit-text-fill-color: initial;
              }
            }
            &:hover {
              .text {
                color: white;
                -webkit-text-fill-color: initial;
                background-clip: initial;
                -webkit-background-clip: initial;
                .god,
                .hizb {
                  -webkit-text-fill-color: initial;
                }
              }
            }
            .num {
              background: white;
              color: #666;
              box-shadow: none;
            }
          }
        }

        .pageFooter {
          user-select: none;
          display: grid;
          justify-items: center;
          align-items: center;
          width: 100%;
          max-width: 500px;
          margin: 25px auto 25px;
          grid-template-columns: 1fr;
          grid-gap: 20px 0;
          justify-content: center;

          @media (min-width: 500px) {
            grid-template-columns: none;

            grid-gap: 0 30px;
          }

          .pageNum {
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
            grid-row: 3/4;
            align-self: end;
            @media (min-width: 500px) {
              grid-column: 2/3;
              grid-row: 1/2;
            }
          }

          .sound {
            @media (min-width: 500px) {
              grid-column: 1/2;
              grid-row: 1/2;
            }
          }
          .explanation {
            @media (min-width: 500px) {
              grid-column: 3/4;
              grid-row: 1/2;
            }
          }
          .sound,
          .explanation {
            label {
              width: 100%;
              display: block;
              font-size: 12px;
              font-weight: bold;
              color: #666;
              font-family: "Tajawal", Helvetica, Arial, sans-serif;
              margin-bottom: 5px;
              margin-right: 5px;
            }
          }
        }
      }
    }
  }
</style>
