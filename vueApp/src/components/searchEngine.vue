<template>
  <div class="searchEngine">
    <!-- bar -->
    <div class="bar">
      <div class="o-search">
        <input type="text" class="o-input" v-model.trim="input" ref="engine" @keyup="search" required />
        <button class="o-close" @click="input = ''"></button>
      </div>
    </div>

    <div class="innerWrapper">
      <!-- tabs -->
      <nav>
        <ul class="scrollbar">
          <li v-for="(item, index) in tabs" :key="index" :class="{ active: item.tab === tab, checked: item.checked }" @click="(tab = item.tab), (results = [])">
            <a>{{ item.text }}</a>
          </li>
        </ul>
        <button class="settingsBtn" v-html="settingsIcon" @click="settingsShown = !settingsShown"></button>
      </nav>

      <!-- resutls -->
      <div v-if="!settingsShown && hasResults" class="results">
        <div class="length" v-if="length">
          <span v-arNum>{{ length }}</span>
        </div>
        <ul @click="goTo($event)" class="scrollbar">
          <template v-if="tab === 'verse'">
            <li v-for="(item, index) of results" :key="index" :data-verse="item.page + '-' + item.globalVerse">
              <div class="verseInfo">
                <span>{{ item.name }} -</span>
                <span v-text="$filters.juz(item.juz) + ' - '"></span>
                <span>{{ item.type === "med" ? "مدنية" : "مكية" }} -</span>
                <span v-arNum>أية {{ item.localVerse }} -</span>
                <span v-arNum>صفحة {{ item.page }}</span>
              </div>
              <a>{{ item.text }}</a>
            </li>
          </template>
          <template v-else-if="tab === 'surah'">
            <li v-for="(item, index) of results" :key="index" :data-surah="item.page + '-' + item.ayahs[0].globalVerse">
              <div class="surahInfo">
                <span>{{ item.name }} -</span>
                <span v-text="$filters.juz(item.juz) + ' - '"></span>
                <span>{{ item.type === "med" ? "مدنية" : "مكية" }} -</span>
                <span v-arNum>أياتها {{ item.verses }} -</span>
                <span v-arNum>صفحة {{ item.page }}</span>
              </div>
              <div class="versesSelectBox">
                <label>اختر الأية</label>
                <div class="o-select" ref="select">
                  <select v-model="selectedVerse">
                    <option v-for="(surah, index) in item.ayahs" :key="index" :value="surah.page + '-' + surah.globalVerse">{{ surah.localVerse }}</option>
                  </select>
                </div>
              </div>
            </li>
          </template>
        </ul>
      </div>

      <!-- NO results hint -->
      <div v-if="!settingsShown && !hasResults" class="noResultsHint">لايوجد نتائج</div>

      <!-- settings -->
      <div v-if="settingsShown" class="settings">
        <div class="settingsItems">
          <template v-for="(item, index) in tabs" :key="index">
            <label v-if="item.tab !== 'surah' && item.tab !== 'verse'">
              {{ item.text }}
              <input type="checkbox" class="o-switch-btn" :checked="item.checked" @click="item.checked = !item.checked" />
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
        ],
        tab: "verse",
        input: "",
        settingsIcon: icons.settings,
        settingsShown: false,
        hasResults: false,
        results: [],
        length: 0,
        selectedVerse: null,
        error: {
          status: false,
          text: "",
        },
      };
    },
    mounted() {
      this.$parent.$parent.$parent.currentVerse = null; // reset
      this.$refs.engine.focus();
    },
    methods: {
      searchForVerse(str, limit = 30) {
        str = str.replace(/ى/g, "ي"); // because all reltaive letters in ref.json are "ي"
        str = str.replace(/ٱ|آ|إ|أ/g, "ا");
        if (window.verses) {
          const resultsArr = window.verses.filter(obj => this.$filters.normalize(obj.text).trim().includes(str));
          const firstChunck = resultsArr.slice(0, limit);
          return { length: resultsArr.length, results: firstChunck };
        }
      },
      searchForSurah(str) {
        str = str.replace(/ى/g, "ي"); // because all reltaive letters in ref.json are "ي"
        str = str.replace(/ٱ|آ|إ|أ/g, "ا");
        if (window.surahs) {
          const resultsArr = window.surahs.filter(obj => this.$filters.normalize(obj.name).trim().includes(str));
          return { length: resultsArr.length, results: resultsArr };
        }
      },
      search(e) {
        if (this.tab === "verse") {
          if (this.input !== "" && e.keyCode === 13) {
            const obj = this.searchForVerse(this.input);
            if (obj.length) {
              this.results = obj.results;
              this.hasResults = true;
            } else {
              this.hasResults = false;
            }
            this.length = obj.length;
            console.log(obj);
          }
        } else if (this.tab === "surah") {
          if (this.input !== "" && e.keyCode === 13) {
            const obj = this.searchForSurah(this.input);
            if (obj.length) {
              this.results = obj.results;
              this.hasResults = true;
            } else {
              this.hasResults = false;
            }
            this.selectedVerse = null;
            this.length = obj.length;
            console.log(obj);
          }
        } else if (this.tab === "page") {
          if (this.input !== "" && e.keyCode === 13) {
            const num = +this.input;
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
            const num = this.getFirstPage(+this.input);
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
            if (this.$parent.$parent.$parent.readViewEnabled) {
              if (readViewComp) readViewComp.setPage(page);
              else console.warn("readViewComp is NOT defined");
            } else {
              this.$router.push("/read/" + page);
            }
          } else if (hasAttr("data-surah")) {
            if (this.selectedVerse) {
              const [page, verse] = this.selectedVerse.split("-");
              console.log({ page, verse });
              console.warn(this.selectedVerse);
              this.$parent.hideModal();
              this.$parent.$parent.$parent.currentVerse = verse;
              if (this.$parent.$parent.$parent.readViewEnabled) {
                if (readViewComp) readViewComp.setPage(page);
                else console.warn("readViewComp is NOT defined");
              } else {
                this.$router.push("/read/" + page);
              }
            } else {
              // if (readViewComp) {
              //   readViewComp.notifyShown = true;
              //   readViewComp.notifyDesc = "برجاء اختيار أية";
              //   setTimeout(() => {
              //     readViewComp.notifyShown = false;
              //   }, 1000);
              // } else {
              alert("برجاء اختيار أية");
              // }
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
          top: 50%;
          left: 10px;
          transform: translateY(-50%);
          cursor: pointer;
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
      }

      .results {
        .length {
          padding: 10px;
          span {
            text-align: center;
            width: 49px;
            height: 50px;
            line-height: 56px;
            border-radius: 50%;
            display: block;
            background: #2f70ec;
            color: white;
            font-size: 18px;
            font-family: "Tajawal", Helvetica, Arial, sans-serif;
            font-weight: bold;
            margin-right: auto;
          }
        }
        ul {
          margin: 0;
          padding: 10px;
          list-style-type: none;
          overflow: auto;
          height: calc(100vh - 212px);
          li {
            border-bottom: 1px solid #eee;
            padding: 10px 0;
            border-radius: 3px;
            cursor: pointer;

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
            }

            &:first-of-type {
              padding-top: 0;
            }
            &:last-of-type {
              border: 0;
              padding-bottom: 0;
            }

            &:hover {
              a {
                background: -webkit-linear-gradient(315deg, #42d392 25%, #647eff);
                background-clip: text;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                transition: background 0.1s ease;
              }
              .verseInfo,
              .surahInfo {
                background: #647eff;
                color: white;
              }
            }

            .verseInfo,
            .surahInfo {
              transition: background 0.1s ease;
              border-radius: 3px;
              display: inline-block;
              padding: 5px !important;
              pointer-events: none;
              overflow: hidden;
              margin-bottom: 10px;
              font-size: 14px;
              padding: 5px 0;
              font-family: "Kitab-Regular2";
              font-weight: bold;
              color: #666;
              span {
                float: right;
                margin-right: 5px;
                &:first-of-type {
                  margin-right: 0;
                }
              }
            }

            .versesSelectBox {
              margin-top: 5px;
              width: 140px;
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
          }
        }
      }
      .noResultsHint {
        text-align: center;
        padding: 10px;
        color: #666;
        font-size: 14px;
        letter-spacing: initial;
      }
      .settings {
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
