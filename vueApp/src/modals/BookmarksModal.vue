<template>
  <ModalSlot name="bookmark">
    <div class="bookmarkInnerWrapper">
      <!-- menu -->
      <nav>
        <ul class="scrollbar">
          <template v-for="(item, index) in tabs" :key="index">
            <li v-if="item.tab" :class="{ active: item.tab === tab, checked: item.checked }" @click="handleSelectedTabs(item)">
              <a>{{ item.text }}</a>
            </li>
          </template>
        </ul>
      </nav>

      <!-- resutls -->
      <div class="results">
        <ul @click="goTo($event)" class="scrollbar">
          <template v-if="tab === 'verse'">
            <li v-for="(item, index) of highlightedVerses" :key="index" :data-verse="item.page + '-' + item.globalVerse">
              <div class="verseInfo">
                <span class="verseInfo__name">{{ item.name }}</span>
                <span class="verseInfo__page" v-arNum>صفحة {{ item.page }}</span>
              </div>
              <a>
                {{ item.text }}
                <span class="verseNum" v-arNum>{{ item.localVerse }}</span>
              </a>
            </li>
          </template>
          <template v-else-if="tab === 'page'">
            <li v-for="(item, index) of bookmarks" :key="index" :data-page="item.page">
              <div class="surahInfo">
                <span class="surahInfo__name">سُورَةُ {{ item.name }}</span>
                <span class="surahInfo__page">صفحة {{ item.page }}</span>
              </div>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </ModalSlot>
</template>

<script>
  // todo complete missing stuff + delete button and color change
  import ModalSlot from "../components/modalSlot.vue";
  export default {
    components: { ModalSlot },
    data() {
      return {
        tabs: [
          { text: "أية", tab: "verse", checked: true },
          { text: "صفحة", tab: "page", checked: true },
        ],
        tab: "verse",
        bookmarks: [],
        highlightedVerses: [],
      };
    },
    beforeMount() {
      this.bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
      this.highlightedVerses = JSON.parse(localStorage.getItem("highlightedVerses")) || [];
    },
    mounted() {
      // oConfirm({
      //   dark: false,
      //   title: "popup title",
      //   desc: " Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo, ex!",
      //   btns: { cancel: { exists: true, text: "Cancel" }, okay: { text: "Okay" } },
      // }).then(res => {
      //   if (res) {
      //     console.log("ok");
      //   } else {
      //     console.log("cancel");
      //   }
      // });
      // oAlert({
      //   dark: false,
      //   title: "popup title",
      //   desc: " Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo, ex!",
      //   okay: { text: "Okay" },
      // }).then(res => {
      //   if (res) {
      //     console.log("ok");
      //   } else {
      //     console.log("cancel");
      //   }
      // });
    },
    methods: {
      handleSelectedTabs(item) {
        this.tab = item.tab;
      },
      goTo(e) {
        if (e.target.nodeName === "LI") {
          const hasAttr = attr => e.target.getAttribute(attr);
          if (hasAttr("data-verse")) {
            const [page, globalVerse] = hasAttr("data-verse").split("-");
            console.log({ page, globalVerse });
            // this.$parent.hideModal();
            return console.warn(this.$parent);

            this.$parent.$parent.$parent.currentVerse = globalVerse;
            this.$parent.$parent.$parent.highlightCurrentVerse = true;
            if (this.$parent.$parent.$parent.readViewEnabled) {
              if (readViewComp) readViewComp.setPage(page);
              else console.warn("readViewComp is NOT defined");
            } else {
              this.$router.push("/read/" + page);
            }
          } else if (hasAttr("data-page")) {
            const page = hasAttr("data-page");
            console.log({ page });
            // this.$parent.hideModal();
            return console.warn(this.$parent);
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
      },
    },
  };
</script>

<style lang="scss" scoped>
  .bookmarkInnerWrapper {
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
        height: calc(100vh - 170px);
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
            &__page {
              margin-right: 10px;
            }
          }
          &:hover {
            a,
            .surahInfo__name {
              background: -webkit-linear-gradient(315deg, #42d392 25%, #647eff);
              background-clip: text;
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              transition: background 0.1s ease;
              .verseNum {
                background: #5fd068 !important;
                color: white !important;
                box-shadow: 0 0 3px 1px rgba(0, 0, 0, 15%) !important;
                background-clip: initial !important;
                -webkit-background-clip: initial !important;
                -webkit-text-fill-color: white !important;
              }
            }
          }
        }
      }
    }
  }
</style>
