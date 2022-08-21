<template>
  <div class="searchEngine">
    <!-- bar -->
    <div class="bar">
      <div class="o-search">
        <input type="text" class="o-input" v-model.trim="input" ref="engine" @keyup="search" @keypress="search" required />
        <button class="o-close" @click="input = ''"></button>
      </div>
    </div>

    <div class="innerWrapper">
      <!-- tabs -->
      <nav>
        <ul class="scrollbar">
          <template v-for="(item, index) in tabs" :key="index">
            <li v-if="item.tab" :class="{ active: item.tab === tab, checked: item.checked }" @click="handleSelectedTabs(item)">
              <a>{{ item.text }}</a>
            </li>
          </template>
        </ul>
        <button :style="[length ? { top: '23px' } : '']" class="settingsBtn" v-html="settingsIcon" @click="settingsShown = !settingsShown"></button>
        <div class="length" v-if="length" v-arNum v-text="$filters.arNum(length) + ' نتيجة'"></div>
      </nav>

      <!-- todo add infinite scroll -->
      <!-- resutls -->
      <div v-if="!settingsShown && hasResults" class="results">
        <ul @click="goTo($event)" class="scrollbar" @scroll="handleScroll($event)" ref="ul">
          <template v-if="tab === 'verse'">
            <li v-for="(item, index) of results" :key="index" :data-verse="item.page + '-' + item.globalVerse">
              <div class="verseInfo">
                <span class="verseInfo__name">{{ item.name }}</span>
                <span class="verseInfo__juz" v-text="$filters.juz(item.juz)"></span>
                <span class="verseInfo__page" v-arNum>صفحة {{ item.page }}</span>
              </div>
              <a>
                {{ item.text }}
                <span class="verseNum" v-arNum>{{ item.localVerse }}</span>
              </a>
            </li>
          </template>
          <template v-else-if="tab === 'surah'">
            <li v-for="(item, index) of results" :key="index" :data-surah="item.page + '-' + item.ayahs[0].globalVerse">
              <div class="surahInfo">
                <span class="surahInfo__name">سُورَةُ {{ item.name }}</span>
                <!-- <span class="juz" v-text="$filters.juz(item.juz)"></span> -->
                <!-- <span class="type">{{ item.type === "med" ? "مدنية" : "مكية" }}</span> -->
                <!-- <span class="totalVerses" v-arNum>أياتها {{ item.verses }}</span> -->
                <!-- <span class="page" v-arNum>صفحة {{ item.page }}</span> -->
              </div>
              <div class="versesSelectBox">
                <label>اختر الأية</label>
                <div class="o-select">
                  <select>
                    <option :selected="index === 0" v-for="(surah, index) in item.ayahs" :key="index" :value="surah.page + '-' + surah.globalVerse">{{ $filters.arNum(surah.localVerse) }}</option>
                  </select>
                </div>
              </div>
            </li>
          </template>
        </ul>
      </div>

      <!-- NO results hint -->
      <div v-if="!settingsShown && !hasResults" class="noResultsHint" v-text="resultsHint"></div>

      <!-- settings -->
      <div v-if="settingsShown" class="settings">
        <div class="settingsItems">
          <template v-for="(item, index) in tabs" :key="index">
            <label v-if="!item.tab || (item.tab !== 'surah' && item.tab !== 'verse')">
              {{ item.text }}
              <input type="checkbox" class="o-switch-btn" :checked="item.checked" @click="handleCheckedTabs(item)" />
            </label>
          </template>
        </div>
        <div class="settingsBtns">
          <button class="o-btn" @click="settingsShown = false">الغاء</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import icons from "../services/icons";
  export default {
    data() {
      return {
        tabs: [
          { text: "أية", tab: "verse", checked: true },
          { text: "سورة", tab: "surah", checked: true },
          { text: "صفحة", tab: "page", checked: false },
          { text: "جزء", tab: "part", checked: false },
          { text: "عرض تلقائى للنتائج", checked: false, id: "infiniteScroll" },
        ],
        tab: "verse",
        input: "",
        settingsIcon: icons.settings,
        settingsShown: false,
        hasResults: false,
        results: [],
        resultsHint: "",
        length: 0,
        hasMore: false,
        resultsCounter: 1,
        scrollLimit: 30,
      };
    },
    mounted() {
      const tabs = JSON.parse(localStorage.getItem("tabs")) || this.tabs;
      this.tabs = tabs;
      this.$parent.$parent.$parent.currentVerse = null; // reset
      this.$refs.engine.focus();
    },
    methods: {
      handleScroll(e) {
        const elm = e.target;
        const reachedEnd = elm.scrollTop >= elm.scrollHeight - elm.offsetHeight;
        const isInfiniteScroll = this.tabs.find(item => (item.id && item.id === "infiniteScroll" ? item : null));
        if (!isInfiniteScroll || !isInfiniteScroll.checked) return;

        if (reachedEnd && isInfiniteScroll && isInfiniteScroll.checked) {
          console.warn("reached end of scroll");
          console.warn(this.tab, this.hasMore);

          if (this.tab === "verse") {
            if (this.hasMore && this.results.length !== this.length) {
              this.resultsCounter += 1;
              const obj = this.searchForVerse(this.input, this.scrollLimit * this.resultsCounter + 1);
              console.log(obj.results);
              this.results = obj.results;
            }
          } else if (this.tab === "surah") {
            if (this.hasMore && this.results.length !== this.length) {
              this.resultsCounter += 1;
              const obj = this.searchForSurah(this.input, this.scrollLimit * this.resultsCounter + 1);
              console.log(obj.results);
              this.results = obj.results;
            }
          }
        }
      },
      handleCheckedTabs(item) {
        item.checked = !item.checked;
        // update tabs options
        localStorage.setItem("tabs", JSON.stringify(this.tabs));
      },
      handleSelectedTabs(item) {
        this.tab = item.tab;
        this.results = [];
        this.length = 0;
        this.resultsHint = "";
        this.resultsCounter = 1;
        this.hasMore = false;
        this.$refs.engine.focus();
      },
      searchForVerse(str, limit = 30) {
        str = str.replace(/ى/g, "ي"); // because all reltaive letters in ref.json are "ي"
        str = str.replace(/ٱ|آ|إ|أ/g, "ا");
        if (window.verses) {
          const resultsArr = window.verses.filter(obj => this.$filters.normalize(obj.text).trim().includes(str));
          const firstChunck = resultsArr.slice(0, limit);
          return { length: resultsArr.length, results: firstChunck };
        }
      },
      searchForSurah(str, limit = 30) {
        str = str.replace(/ى/g, "ي"); // because all reltaive letters in ref.json are "ي"
        str = str.replace(/ٱ|آ|إ|أ/g, "ا");
        if (window.surahs) {
          const resultsArr = window.surahs.filter(obj => this.$filters.normalize(obj.name).trim().includes(str));
          const firstChunck = resultsArr.slice(0, limit);
          return { length: resultsArr.length, results: firstChunck };
        }
      },
      reset() {
        this.resultsCounter = 1;
        this.hasMore = false;
        const ul = this.$refs.ul;
        if (ul) ul.scrollTo(0, 0);
      },
      search(e) {
        if (this.tab === "verse") {
          if (this.input !== "" && e.keyCode === 13) {
            this.reset();
            const obj = this.searchForVerse(this.input, this.scrollLimit + 1);
            if (obj.length) {
              this.results = obj.results;
              this.hasResults = true;
              if (obj.results.length === this.scrollLimit + 1) this.hasMore = true;
              else this.hasMore = false;
            } else {
              this.hasResults = false;
              this.resultsHint = "لايوجد نتائج";
              this.hasMore = false;
            }
            this.length = obj.length;
            console.log(obj.results);
            console.log(obj);
            this.$refs.engine.blur();
          }
        } else if (this.tab === "surah") {
          if (this.input !== "" && e.keyCode === 13) {
            this.reset();
            const obj = this.searchForSurah(this.input, this.scrollLimit + 1);
            if (obj.length) {
              this.results = obj.results;
              this.hasResults = true;
              if (obj.results.length === this.scrollLimit + 1) this.hasMore = true;
              else this.hasMore = false;
            } else {
              this.hasResults = false;
              this.resultsHint = "لايوجد نتائج";
              this.hasMore = false;
            }
            this.length = obj.length;
            console.log(obj.results);
            console.log(obj);
            this.$refs.engine.blur();
          }
        } else if (this.tab === "page") {
          if (this.input !== "" && e.keyCode === 13) {
            const num = +this.input;
            if (isNaN(num) || (!isNaN(num) && num < 1) || (!isNaN(num) && num > 604)) {
              this.hasResults = false;
              return (this.resultsHint = this.$filters.arNum("ادخل رقم بين 1 و 604"));
            }
            this.resultsHint = "";
            this.$parent.hideModal();
            if (this.$parent.$parent.$parent.readViewEnabled) {
              if (readViewComp) readViewComp.setPage(num);
              else console.warn("readViewComp is NOT defined");
            } else {
              this.$router.push("/read/" + num);
            }
          }
        } else if (this.tab === "part") {
          if (this.input !== "" && e.keyCode === 13) {
            let num = +this.input;
            if (isNaN(num) || (!isNaN(num) && num < 1) || (!isNaN(num) && num > 30)) {
              this.hasResults = false;
              return (this.resultsHint = this.$filters.arNum("ادخل رقم بين 1 و 30"));
            }
            num = this.getFirstPage(num);
            this.$parent.hideModal();
            if (this.$parent.$parent.$parent.readViewEnabled) {
              if (readViewComp) readViewComp.setPage(num);
              else console.warn("readViewComp is NOT defined");
            } else {
              this.$router.push("/read/" + num);
            }
          }
        }
      },
      getFirstPage(part) {
        return +((part - 1) * 2 + "2");
      },
      goTo(e) {
        if (e.target.nodeName === "LI") {
          const hasAttr = attr => e.target.getAttribute(attr);
          if (hasAttr("data-verse")) {
            const [page, globalVerse] = hasAttr("data-verse").split("-");
            console.log({ page, globalVerse });
            this.$parent.hideModal();
            this.$parent.$parent.$parent.currentVerse = globalVerse;
            this.$parent.$parent.$parent.highlightCurrentVerse = true;
            if (this.$parent.$parent.$parent.readViewEnabled) {
              if (readViewComp) readViewComp.setPage(page);
              else console.warn("readViewComp is NOT defined");
            } else {
              this.$router.push("/read/" + page);
            }
          } else if (hasAttr("data-surah")) {
            // return console.warn(e.target);
            const select = e.target.querySelector("select");
            if (select) {
              const [page, verse] = select.selectedOptions[0].value.split("-");
              console.log({ page, verse });
              this.$parent.hideModal();
              this.$parent.$parent.$parent.currentVerse = verse;
              this.$parent.$parent.$parent.highlightCurrentVerse = true;
              if (this.$parent.$parent.$parent.readViewEnabled) {
                if (readViewComp) readViewComp.setPage(page);
                else console.warn("readViewComp is NOT defined");
              } else {
                this.$router.push("/read/" + page);
              }
            }
          }
        }
      },
    },
  };
</script>

<style lang="scss">
  .searchEngine {
    padding: 2px;

    .bar {
      width: 100%;
      .o-search {
        width: 100%;
        &::before {
          right: 10px;
          left: auto;
        }
        input {
          height: 40px;
          padding: 0 30px 0 25px;
        }
        .o-close {
          height: 100%;
          right: auto;
          left: 0;
          top: 0;
          background-position: 3px 11px;
          transform: rotate(180deg);
        }
      }
    }

    .innerWrapper {
      width: 100%;
      min-height: 70px;
      margin-top: 5px;
      border-radius: 3px;
      border: 1px solid #d8d8d8;

      nav {
        padding: 10px;
        padding-left: 35px;
        padding-bottom: 5px;
        border-bottom: 1px solid #d8d8d8;
        position: relative;
        background: white;

        ul {
          margin: 0;
          padding: 0;
          padding-bottom: 5px;
          padding-left: 5px;
          list-style-type: none;
          display: flex;
          white-space: nowrap;
          overflow: auto;
          li {
            display: none;
            cursor: pointer;
            padding: 5px 10px 2.5px 10px;
            border-radius: 50px;
            margin-left: 10px;
            border: 1px solid #eee;
            user-select: none;
            &:last-of-type {
              margin-left: 0;
            }
            a {
              pointer-events: none;
              text-decoration: none;
              text-align: center;
              display: block;
              font-size: 14px;
              color: #666;
              font-family: "Tajawal", Helvetica, Arial, sans-serif;
            }
            &.active {
              background: #2f70ec;
              border-color: #2f70ec;
              a {
                color: white;
                font-weight: bold;
              }
            }
            &.checked {
              display: inline-block;
            }
          }
        }

        .settingsBtn {
          width: 25px;
          height: 25px;
          background: transparent;
          border: 0;
          outline: none !important;
          padding: 0;
          position: absolute;
          left: 10px;
          cursor: pointer;
          top: 50%;
          transform: translateY(-50%);
          svg {
            width: 100%;
            height: 100%;
            color: #666;
          }
          &:hover {
            svg {
              transition: color 0.3s ease;
              color: #2f70ec;
            }
          }
          &:active {
            transform: translateY(-50%) perspective(1px) translateZ(-0.04px);
            transition: 200ms cubic-bezier(0.12, 0.8, 0.32, 1);
          }
        }

        .length {
          font-size: 12px;
          color: #666;
          font-family: "Tajawal", Helvetica, Arial, sans-serif;
          letter-spacing: 1px;
          margin-top: 5px;
          font-weight: bold;
        }
      }

      .results {
        ul {
          margin: 0;
          padding: 10px;
          list-style-type: none;
          overflow: auto;
          height: calc(100vh - 255px);
          li {
            border-bottom: 1px solid #eee;
            padding: 10px 0;
            border-radius: 3px;
            cursor: pointer;
            overflow: hidden;

            a {
              display: block;
              font-family: "Kitab-Regular2";
              font-size: 20px;
              font-weight: bold;
              color: #666;
              text-decoration: none;
              padding: 10px 5px;
              border-radius: 3px;
              transition: background 0.1s ease;
              user-select: none;
              pointer-events: none;

              .verseNum {
                pointer-events: none;
                font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
                width: 35px;
                height: 35px;
                line-height: 35px;
                border-radius: 50%;
                display: inline-block;
                font-size: 15px;
                text-align: center;
                margin: 0 8px;
                user-select: none;
                background: #5fd068;
                color: white;
                box-shadow: 0 0 3px 1px rgba(0, 0, 0, 15%);
              }
            }

            &:first-of-type {
              padding-top: 0;
            }
            &:last-of-type {
              border: 0;
              padding-bottom: 0;
            }

            .verseInfo {
              pointer-events: none;
              span {
                font-size: 12px;
                font-weight: bold;
                color: #666;
                font-family: "Kitab-Regular2";
              }
              &__name {
                float: left;
              }
              &__juz {
                float: right;
                margin-left: 10px;
              }
              &__page {
              }
            }

            .surahInfo {
              pointer-events: none;
              float: right;
              span {
                font-size: 12px;
                font-weight: bold;
                color: #666;
                font-family: "Kitab-Regular2";
              }
              &__name {
                font-size: 20px !important;
              }
            }

            .versesSelectBox {
              width: 140px;
              float: left;
              padding: 3px;
              label {
                margin-bottom: 10px;
                font-family: "Tajawal", Helvetica, Arial, sans-serif;
                font-weight: bold;
                font-size: 14px;
                color: #666;
                pointer-events: none;
              }
              .o-select {
                max-width: 70px;
                display: inline-block;
                margin-right: 10px;
                min-width: 70px;
              }
            }

            &:hover {
              a,
              .surahInfo__name {
                color: #647eff;
                a {
                  color: #647eff !important;
                  
                }

                .verseNum {
                  background: #5fd068 !important;
                  color: white !important;
                  box-shadow: 0 0 3px 1px rgba(0, 0, 0, 15%) !important;
                  background-clip: initial !important;
                  -webkit-background-clip: initial !important;
                  -webkit-text-fill-color: white !important;
                }
              }
              a {
                color: #647eff !important;
              }
            }
          }
        }
      }
      .noResultsHint {
        text-align: center;
        padding: 10px;
        color: #666;
        font-size: 14px;
        letter-spacing: initial;
        user-select: none;
      }
      .settings {
        user-select: none;
        .settingsItems {
          padding: 0 10px;
          label {
            display: block;
            width: 100%;
            margin-bottom: 5px;
            border-bottom: 1px solid #eee;
            padding: 10px 0;
            color: #666;
            font-size: 14px;
            font-weight: bold;
            &:last-of-type {
              border-bottom: 0;
              margin-bottom: 0;
            }
            input {
              float: left;
            }
          }
        }
        .settingsBtns {
          background: #eee;
          padding: 10px;
          button {
            font-family: "Tajawal", Helvetica, Arial, sans-serif;
            line-height: 35px;
            font-weight: bold;
            padding: {
              left: 20px;
              right: 20px;
            }
          }
        }
      }
    }
  }
</style>
