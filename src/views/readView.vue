<template>
  <div class="readView">
    <NotFound v-if="isLoading" />
    <NotifyModal v-if="!isLoading && notifyShown" :class="[notifyShown ? notifyClass : '']" :desc="notifyDesc" />

    <OptionsRect v-show="!isLoading && optionsRectShown" @update="handlePlaying(e, $event)" @textCopied="textCopied()" :options="optionsData" :audio="audioInstance" />

    <button class="o-btn navBtns next" @click="next()" v-html="nextIcon"></button>
    <button class="o-btn navBtns prev" @click="prev()" v-html="prevIcon"></button>

    <div class="container" v-if="!isLoading && currentPage" ref="page" :style="{ left: pageLeft + 'px' }">
      <div class="page">
        <!-- bar -->
        <div class="bar" ref="bar">
          <span class="name" v-text="getSurahName"></span>
          <div xv-if="pageNumPos == 'top'" class="pageNum" v-text="$filters.arNum(pageNum)"></div>
          <span class="juz" v-text="$filters.juz(currentPage[0].juz)"></span>
        </div>

        <!-- options -->
        <div class="options">
          <button @click="$router.push('/')" v-html="homeIcon" class="o-btn"></button>
          <button @click="showModal('search')" v-html="searchIcon" class="o-btn"></button>
          <button :disabled="isBookmarkDisabled" :class="['o-btn', isBookmarkDisabled ? 'disabled' : '']" v-html="bookmarkIcon" @click="bookmarkPage(currentPage[0])"></button>
          <template v-if="isInitialPlaying">
            <button v-if="isPlaying" v-html="pauseIcon" @click="pauseReciting()" class="o-btn"></button>
            <button v-else v-html="playIcon" @click="resumeReciting()" class="o-btn"></button>
          </template>
          <label v-if="isInitialPlaying" class="autoReciting">
            <input type="checkbox" class="o-switch-btn" @click="auto" :checked="isAuto" />
            تلقائي
          </label>
        </div>

        <div :class="['pageContent', hasSajda ? 'hasSajda' : '']">
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
            <span :id="'verse_' + obj.globalVerse" :class="[isHighlightedVerse(obj) ? isHighlightedVerse(obj) : '', 'verse']" @click="showVerseOpt(obj, $event)">
              <span class="text" v-html="$filters.highlight(obj.text, godArr, 'god')"></span>
              <span class="num" v-text="$filters.arNum(obj.localVerse)"></span>
              <div v-if="obj.sajda" class="sajda">
                <span v-html="sajdaIcon"></span>
                <span>سجدة</span>
              </div>
            </span>
          </template>
        </div>

        <!-- page number -->
        <div class="pageFooter">
          <div xv-if="pageNumPos == 'bottom'" class="pageNum" v-text="$filters.arNum(pageNum)"></div>

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
      isScrolling: false,
      pageLeft: 0,
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
      nextIcon: icons.next,
      prevIcon: icons.prev,
      homeIcon: icons.home,
      playIcon: icons.playSolid,
      pauseIcon: icons.pause,
      sajdaIcon: icons.sajda,
      pageNum: null,
      currentPage: null,
      isLoading: true,
      interval: null,
      hasSajda: false,
      pageNumPos: "top",
      start: "بِسۡمِ ٱللَّهِ ٱلرَّحۡمَـٰنِ ٱلرَّحِیمِ",
      godArr: ["اللهم", "اله", "واحد", "هو", "لله", "الله", "رب", "ربهم", "ربكم", "ربك", "ربه", "ربنا", "لرب", "ربي", "ربها", "لربك", "ربكما", "ربهما", "ربها"],
    };
  },
  created() {
    this.pageNum = +this.$route.params.page;
    console.log({ pageNum: this.pageNum });
    if (isNaN(this.pageNum) || (!isNaN(this.pageNum) && this.pageNum < 1) || (!isNaN(this.pageNum) && this.pageNum > 604)) {
      return (this.isLoading = true);
    }

    function getCurrentPage() {
      this.currentPage = window.pages[this.pageNum];
      console.log("currentPage", this.currentPage);

      if (this.currentPage) {
        this.hasSajda = !!this.currentPage.find((item) => item.sajda);
        const obj = this.getLastReadObj(this.currentPage);
        localStorage.setItem("lastRead", JSON.stringify(obj));
        this.isLoading = false;
      }
    }

    if (window.pages) {
      getCurrentPage.bind(this)();
    } else {
      console.warn("window.pages is NOT defined!");
      this.isLoading = true;
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
    isAuto() {
      localStorage.setItem("autoReciting", JSON.stringify(this.isAuto));
    },
  },
  computed:{
    getSurahName() {
      const firstSurahName = this.currentPage[0].name;
      const secondSurahName = this.currentPage[this.currentPage.length - 1].name;
      const firstSurah = this.currentPage
        .map((obj) => {
          if (obj.surah === this.currentPage[0].surah) return obj.text.length;
        })
        .filter((item) => item);

      const secondSurah = this.currentPage
        .map((obj) => {
          if (obj.surah !== this.currentPage[0].surah) return obj.text.length;
        })
        .filter((item) => item);

      const obj = {
        0: { name: firstSurahName, total: Math.max(...firstSurah) },
        1: { name: secondSurahName, total: Math.max(...secondSurah) },
      };
      // console.warn(obj);
      return obj[0].total > obj[1].total ? obj[0].name : obj[1].name; 
    },
  },
  beforeMount() {
    // options
    const optionsData = JSON.parse(localStorage.getItem("optionsData")) || { reciter: "mahermuaiqly", explainer: "muyassar", translator: "ahmedraza" };
    this.optionsData.reciter = optionsData.reciter;
    this.optionsData.explainer = optionsData.explainer;
    this.optionsData.translator = optionsData.translator;
    // auto
    const isAuto = JSON.parse(localStorage.getItem("autoReciting")) || false;
    this.isAuto = isAuto;
  },
  mounted() {
    this.$parent.$parent.readViewEnabled = true;
    window.readViewComp = this;
    this.highlightVerseOfSearch();
    this.audioInstance = this.$parent.$parent.audioInstance;

    // navigate to pages
    if (this.$parent.$parent.readViewEnabled) {
      window.onscroll = () => {
        this.isScrolling = true;
        // console.log(this.isScrolling);

        const bar = this.$refs.bar;
        if (bar) {
          let y = window.pageYOffset;
          let offsetBottom = bar.offsetTop - window.innerHeight;
          let offsetTop = bar.offsetTop;
          let height = bar.clientHeight;
          let total = offsetTop + height;
          if (y >= offsetTop && y <= total) {
            this.pageNumPos = "top";
          } else if (y >= offsetBottom) {
            this.pageNumPos = "bottom";
          }
        }
      };

      window.onresize = () => this.resetPagNumPos();

      // keyboard
      document.body.onkeydown = (e) => {
        if (e.keyCode === 39) this.next();
        else if (e.keyCode === 37) this.prev();
      };
      // swipe via touch
      this.enableSwipe();
    }
  },
  updated() {
    if (this.$parent.$parent.highlightCurrentVerse) {
      this.highlightVerseOfSearch();
    }
  },
  unmounted() {
    this.$parent.$parent.readViewEnabled = false;
    if (this.interval) clearInterval(this.interval);
  },
  methods: {
    enableSwipe() {
      const $this = this;
      var isDown;
      var startX;
      var currentX;
      var walkX;
      let direction;
      let distance;
      let threshold = 150;
      const page = this.$refs.page;
      if (!page) return;

      page.ontouchstart = dragStart;
      function dragStart(e) {
        e.stopPropagation();
        isDown = true;
        e = e || window.event;
        startX = Math.round(e.touches[0].clientX);
        page.addEventListener("touchmove", dragMove);
        page.addEventListener("touchend", dragEnd);

        function dragEnd() {
          $this.isScrolling = false;
          // reset
          isDown = false;

          if (distance >= threshold) {
            console.warn("foo");
            page.classList.add("pauseAnimation");
            $this.pageLeft = 0;
            if (direction === "left") $this.prev();
            else $this.next();
          } else if (distance < threshold) {
            page.classList.remove("pauseAnimation");
            $this.pageLeft = 0; // reset
          }
          // reset
          distance = null;
          direction = "";
          page.removeEventListener("touchmove", dragMove);
          page.removeEventListener("touchend", dragEnd);
          console.log($this.isScrolling);
        }

        function dragMove(e) {
          e = e || window.event;
          if (isDown) {
            currentX = Math.round(e.touches[0].clientX);
            // get direction
            walkX = currentX - startX;
            if (walkX > 0) direction = "right";
            else direction = "left";
            distance = walkX < 0 ? walkX * -1 : walkX;

            // console.warn(distance);
            if (distance <= threshold && !$this.isScrolling) $this.pageLeft = walkX;
          }
        }
      }
    },
    highlightVerseOfSearch() {
      console.warn("highlightVerseOfSearch");
      const globalVerse = this.$parent.$parent.currentVerse;
      console.warn({ globalVerse });
      if (globalVerse) {
        const verseElm = document.getElementById("verse_" + globalVerse);
        if (verseElm) {
          verseElm.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
          verseElm.classList.add("red");
          setTimeout(() => {
            verseElm.classList.remove("red");
            this.$parent.$parent.highlightCurrentVerse = false;
          }, 3000);
        }
      }
    },
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
      const verseObj = highlightedVersesArr.find((item) => obj.globalVerse === item.globalVerse);
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
    resetPagNumPos() {
      const hasScrollBar = document.body.scrollHeight - window.innerHeight > 0;
      if (hasScrollBar) this.pageNumPos = "top";
    },
    next() {
      if (this.pageNum < 604) this.pageNum++;
      else return (this.pageNum = 604);
      this.currentPage = window.pages[this.pageNum];
      this.hasSajda = !!this.currentPage.find((item) => item.sajda);

      location.hash = "#read/" + this.pageNum; // update hash
      this.optionsRectShown = false;
      console.log(this.currentPage);
      const obj = this.getLastReadObj(this.currentPage);
      localStorage.setItem("lastRead", JSON.stringify(obj));
      window.scrollTo({ top: 0, left: 0 });
      this.resetPagNumPos();
    },
    prev() {
      if (this.pageNum > 1 && this.pageNum <= 604) this.pageNum--;
      else return (this.pageNum = 1);
      this.currentPage = window.pages[this.pageNum];
      this.hasSajda = !!this.currentPage.find((item) => item.sajda);

      location.hash = "#read/" + this.pageNum; // update hash
      this.optionsRectShown = false;
      console.log(this.currentPage);
      const obj = this.getLastReadObj(this.currentPage);
      localStorage.setItem("lastRead", JSON.stringify(obj));
      window.scrollTo({ top: 0, left: 0 });
      this.resetPagNumPos();
    },
    setPage(num) {
      this.pageNum = num;
      this.currentPage = window.pages[num];

      this.hasSajda = !!this.currentPage.find((item) => item.sajda);

      location.hash = "#read/" + num; // update hash
      this.optionsRectShown = false;
      console.log(this.currentPage);
      const obj = this.getLastReadObj(this.currentPage);
      localStorage.setItem("lastRead", JSON.stringify(obj));
      window.scrollTo({ top: 0, left: 0 });
      this.resetPagNumPos();
    },
    showModal(name) {
      this.$parent.$parent.modal = { name };
    },
    deselectVerses() {
      const verses = document.querySelectorAll(".page .verse");
      verses.forEach((verseNode) => verseNode.classList.remove("selected"));
    },
    showVerseOpt(obj, e) {
      // reset verses
      this.deselectVerses();
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
        name: this.getSurahName,
        type: arg.type,
        surah: arg.surah,
        verses: arg.verses,
      };
      console.log(obj);

      const bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
      const hasSamePage = bookmarks.find((item) => item.page === obj.page);
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
      }, 1000);
    },
  },
};
</script>

<style lang="scss">
.readView {
  .container {
    position: relative;
    transition: left 0.3s ease;
    &.pauseAnimation {
      transition: none !important;
      animation: none !important;
    }
    .page {
      .bar {
        user-select: none;
        overflow: hidden;
        padding: 5px 0;
        margin-bottom: 20px;
        position: relative;
        span {
          font-size: 12px;
          font-weight: bold;
          color: #666;
          line-height: 35px;
          border-bottom: 2px solid #6a11cb;
        }
        .name {
          float: left;
          font-family: "Kitab-Regular2";
          font-size: 15px;
        }
        .juz {
          float: right;
          letter-spacing: 1px;
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
          box-shadow: 0 0 3px 1px rgba(0, 0, 0, 15%);
          margin: 0 auto;
          position: absolute;
          letter-spacing: 1px;
          left: 50%;
          transform: translateX(-50%);
        }
      }

      .options {
        overflow: hidden;
        margin-bottom: 5px;
        padding: 5px 0;
        button {
          float: right;
          width: 40px;
          height: 40px;
          background: linear-gradient(90deg, #6a11cb, #2f70ec);
          margin: 0px 5px;
          position: relative;
          border-radius: 50%;

          svg {
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

      .pageContent {
        position: relative;
        transition: left 0.3s ease;
        &.hasSajda {
          padding-left: 40px;
          &:before {
            content: "";
            left: 35px;
            top: 0;
            position: absolute;
            width: 1px;
            height: 100%;
            background: #d8d8d8;
          }
        }
        &.pauseAnimation {
          transition: none !important;
          animation: none !important;
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
          width: 30px;
          height: 30px;
          line-height: 30px;
          border-radius: 50%;
          margin: 0 auto;
          margin-bottom: 10px;
          background: white;
          color: #666;
          font-size: 12px;
          font-weight: bold;
        }
        .name {
          font-weight: bold;
          font-size: 20px;
          font-family: "Kitab-Regular2";
          margin: 0;
          margin-bottom: 5px;
        }
        .other {
          margin: 0;
          font-family: "Tajawal", Helvetica, Arial, sans-serif;
          font-size: 12px;
          font-weight: bold;
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
          color: white;
          box-shadow: 0 0 3px 1px rgba(0, 0, 0, 15%);
          display: inline-block;
          font-size: 15px;
          text-align: center;
          margin: 0 8px;
          user-select: none;
        }
        .sajda {
          position: absolute;
          left: 0;
          text-align: center;
          transform: translateY(-100%);
          svg {
            display: block;
            margin: 0 auto;
            margin-bottom: 2.5px;
          }
          span {
            display: block;
            font-size: 10px;
            font-family: "Tajawal", Helvetica, Arial, sans-serif;
            font-weight: bold;
            color: #666;
          }
        }

        @mixin selected {
          background: #f7f7f7 !important;
          border-radius: 5px !important;
          // transition: background 0.1s ease-in-out !important;
          transition: all 0.1s ease-in-out !important;
          .text {
            color: #647eff !important;
            // transition: all 0.1s ease-in-out !important;
            // background: -webkit-linear-gradient(315deg, #42d392 25%, #647eff) !important;
            // background-clip: text !important;
            // -webkit-background-clip: text !important;
            // -webkit-text-fill-color: transparent !important;
            // color: transparent !important;
            .god,
            .hizb {
              color: #647eff !important;
              // -webkit-text-fill-color: transparent !important;
              // color: transparent !important;
            }
          }
          .num {
            background: #5fd068 !important;
            color: white !important;
            box-shadow: 0 0 3px 1px rgba(0, 0, 0, 15%) !important;
          }
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
        &.red {
          background: #f94c66 !important;
        }

        &.red,
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

        &.selected {
          @include selected;
        }

        &:hover {
          @include selected;
        }
      }

      .pageFooter {
        user-select: none;
        display: grid;
        justify-items: center;
        align-items: center;
        width: 100%;
        max-width: 500px;
        margin: 10px auto;
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
          display: inline-block;
          margin: 0;
          box-shadow: 0 0 3px 1px rgba(0, 0, 0, 15%);
          letter-spacing: 1px;
          text-align: center;
          text-indent: 0;
          @media (min-width: 500px) {
            grid-column: 1/4;
            grid-row: 1/2;
            margin-bottom: 10px;
          }
        }

        .sound {
          @media (min-width: 500px) {
            grid-column: 1/3;
            grid-row: 3/4;
          }
        }
        .explanation {
          @media (min-width: 500px) {
            grid-column: 3/4;
            grid-row: 3/4;
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
  button.navBtns {
    width: 40px;
    height: 40px;
    background: linear-gradient(90deg, #6a11cb, #2f70ec);
    margin: 0px 5px;
    position: relative;
    border-radius: 50%;
    opacity: 0.2;
    &.next {
      position: fixed;
      top: 50%;
      transform: translateY(-50%);
      z-index: 999;
      right: 0;
    }
    &.prev {
      position: fixed;
      top: 50%;
      transform: translateY(-50%);
      z-index: 999;
      left: 0;
    }
    svg {
      height: 20px;
      color: white;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
    &:active {
      transform: perspective(1px) translateZ(-0.04px) translateY(-50%);
      transition: 200ms cubic-bezier(0.12, 0.8, 0.32, 1);
    }
    &:hover {
      opacity: 1;
    }
  }
}
</style>
