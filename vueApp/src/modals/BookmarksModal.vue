<template>
  <ModalSlot name="bookmark" :hide="hide">
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
                <span class="verseInfo__juz">{{ $filters.juz(item.juz) }}</span>
                <span class="verseInfo__separator">-</span>
                <span class="verseInfo__page" v-arNum>صفحة {{ item.page }}</span>
              </div>
              <a>
                {{ item.text }}
                <span class="verseNum" v-arNum>{{ item.localVerse }}</span>
                <button class="o-btn remove" @click="removeVerse(item)" v-html="closeIcon"></button>
              </a>
            </li>
            <div class="emptyBookmarks" v-if="!highlightedVerses.length">لايوجد أيات محفوظة</div>
          </template>

          <template v-else-if="tab === 'page'">
            <li v-for="(item, index) of bookmarks" :key="index" :data-page="item.page">
              <div class="surahInfo">
                <span class="surahInfo__page" v-arNum>{{ item.page }}</span>
                <span class="surahInfo__name">سُورَةُ {{ item.name }}</span>
              </div>
              <button class="o-btn remove" @click="removePage(item)" v-html="closeIcon"></button>
            </li>
            <div class="emptyBookmarks" v-if="!bookmarks.length">لايوجد صفحات محفوظة</div>
          </template>
        </ul>
      </div>
    </div>
  </ModalSlot>
</template>

<script>
  import ModalSlot from "../components/modalSlot.vue";
  import icons from "../services/icons";
  export default {
    components: { ModalSlot },
    data() {
      return {
        hide: false,
        tabs: [
          { text: "أية", tab: "verse", checked: true },
          { text: "صفحة", tab: "page", checked: true },
        ],
        tab: "verse",
        bookmarks: [],
        highlightedVerses: [],
        closeIcon: icons.close,
      };
    },
    beforeMount() {
      this.bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
      this.highlightedVerses = JSON.parse(localStorage.getItem("highlightedVerses")) || [];
    },
    mounted() {
      this.hide = false;
    },
    unmounted() {
      this.hide = false;
    },
    methods: {
      removeVerse(obj) {
        oConfirm({
          title: "المفضلة",
          desc: "هل تريد حذف هذه الأية؟",
          btns: { cancel: { exists: true, text: "الغاء" }, okay: { text: "نعم" } },
        }).then(res => {
          if (res) {
            this.highlightedVerses = this.highlightedVerses.filter(item => item.globalVerse !== obj.globalVerse);
            localStorage.setItem("highlightedVerses", JSON.stringify(this.highlightedVerses));
          }
        });
      },
      removePage(obj) {
        oConfirm({
          title: "المفضلة",
          desc: "هل تريد حذف هذه الصفحة؟",
          btns: { cancel: { exists: true, text: "الغاء" }, okay: { text: "نعم" } },
        }).then(res => {
          if (res) {
            this.bookmarks = this.bookmarks.filter(item => item.page !== obj.page);
            localStorage.setItem("bookmarks", JSON.stringify(this.bookmarks));
          }
        });
      },
      handleSelectedTabs(item) {
        this.tab = item.tab;
      },
      goTo(e) {
        if (e.target.nodeName === "LI") {
          const hasAttr = attr => e.target.getAttribute(attr);
          if (hasAttr("data-verse")) {
            const [page, globalVerse] = hasAttr("data-verse").split("-");
            console.log({ page, globalVerse });
            this.hide = true; // hide modal
            this.$parent.currentVerse = globalVerse;
            this.$parent.highlightCurrentVerse = true;
            if (this.$parent.readViewEnabled) {
              if (readViewComp) readViewComp.setPage(page);
              else console.warn("readViewComp is NOT defined");
            } else {
              this.$router.push("/read/" + page);
            }
          } else if (hasAttr("data-page")) {
            const page = hasAttr("data-page");
            console.log({ page });
            this.hide = true; // hide modal
            this.$parent.currentVerse = null;
            this.$parent.highlightCurrentVerse = null;
            if (this.$parent.readViewEnabled) {
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

<style lang="scss">
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
    }
    .results {
      ul {
        margin: 0;
        padding: 10px;
        list-style-type: none;
        overflow: auto;
        height: calc(100vh - 170px);
        .emptyBookmarks {
          text-align: center;
          margin: 10px 0;
          color: #666;
          user-select: none;
        }
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
              font-size: 14px;
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

          button.remove {
            width: 35px;
            height: 35px;
            pointer-events: auto;
            padding: 0;
            border-radius: 50%;
            position: relative;
            top: -4px;
            border-color: transparent;
            position: relative;
            background: #f94c66;
            svg {
              width: 20px;
              height: 20px;
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              color: white;
            }
          }

          .verseInfo {
            pointer-events: none;
            overflow: hidden;
            user-select: none;
            span {
              user-select: none;
              font-size: 12px;
              font-weight: bold;
              color: #666;
              font-family: "Kitab-Regular2";
              float: left;
            }
            &__page,
            &__juz,
            &__separator {
              float: right !important;
              margin-left: 5px;
            }
            &__juz {
            }
            &__separator {
            }
          }

          .surahInfo {
            pointer-events: none;
            float: right;
            user-select: none;
            span {
              user-select: none;
              font-weight: bold;
              color: #666;
            }
            &__name {
              font-family: "Kitab-Regular2";
              font-size: 20px;
            }
            &__page {
              font-size: 14px;
              font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
              margin-left: 10px;
              width: 35px;
              height: 35px;
              padding: 0;
              border-radius: 50%;
              position: relative;
              border-color: transparent;
              background: #5fd068;
              float: right;
              text-align: center;
              color: white !important;
              line-height: 38px;
            }
            & ~ button.remove {
              top: auto;
              float: left;
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
