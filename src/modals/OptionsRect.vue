<template>
  <div class="OptionsRect" :style="calcStyle">
    <div class="highlight" @click="highlight(options.obj, $event), hide()">
      <button class="orange"></button>
      <button class="purple"></button>
      <button class="blue"></button>
      <button class="noColor"></button>
    </div>
    <div class="trans">
      <button @click="getVerseTrans(options.obj), hide()" v-html="translateIcon"></button>
    </div>
    <div class="copyText">
      <button @click="copyText(options.obj), hide()" v-html="clipboardIcon"></button>
    </div>
    <div class="explain">
      <button @click="getVerseExplanation(options.obj), hide()" v-html="bookIcon"></button>
    </div>
    <div class="sound">
      <button @click="reciteVerse(options.obj), hide()" v-html="playIcon"></button>
    </div>
  </div>
</template>

<script>
  import icons from "../services/icons";
  export default {
    computed: {
      calcStyle() {
        if (this.width && this.height) {
          const obj = { top: this.options.coords.top - this.height - 5 + "px" };
          if (this.options.coords.width < this.width) {
            obj.left = this.options.coords.right - this.width + "px";
          } else {
            obj.left = this.options.coords.left + "px";
          }
          return obj;
        }
      },
    },
    data() {
      return {
        translateIcon: icons.translate,
        clipboardIcon: icons.clipboard,
        bookIcon: icons.book,
        playIcon: icons.play,
        height: 0,
        width: 0,
      };
    },
    updated() {
      if (this.$parent.optionsRectShown && !this.$parent.isLoading) {
        this.width = this.$el.getBoundingClientRect().width;
        this.height = this.$el.getBoundingClientRect().height;
      }
    },
    mounted() {
      // blur
      document.body.addEventListener("click", e => {
        if (e.target !== this.$el && e.target !== this.options.coords.elm) {
          this.hide();
        }
      });
    },
    props: ["options", "audio", "shown"],
    methods: {
      hide() {
        this.$emit("hide");
      },
      reciteVerse(obj) {
        obj = verses[obj.globalVerse - 1];
        if (this.$parent.isAuto && obj.page !== this.$parent.pageNum) this.$parent.next();
        console.warn("current playing verse: ", obj);
        const rate = 64;
        const url = "https://cdn.islamic.network/quran/audio/" + rate + "/ar." + this.options.reciter + "/" + obj.globalVerse + ".mp3";
        this.audio.src = url;
        this.audio.play();
        const currentVerseElm = this.options.coords.elm;
        currentVerseElm.classList.add("selected");
        this.audio.onended = () => {
          console.log("ended");
          currentVerseElm.classList.remove("selected");
          this.$emit("update", {
            isPlaying: false,
            isInitialPlaying: true,
          });
          // todo handle auto 
          if (this.$parent.isAuto) {
            if (obj.page !== this.$parent.pageNum) this.$parent.next();
            this.reciteVerse({ globalVerse: (obj.globalVerse += 1) });
          }
        };
        this.$emit("update", {
          isPlaying: true,
          isInitialPlaying: true,
        });
      },
      getVerseExplanation(obj) {
        const url = "http://api.alquran.cloud/ayah/" + obj.surah + ":" + obj.localVerse + "/editions/ar." + this.options.explainer;
        fetch(url)
          .then(res => res.json())
          .then(res => {
            const text = res.data[0].text;
            this.$parent.$parent.$parent.modal = {
              name: "explanation",
              data: { text, explainer: this.options.explainer },
            };
          })
          .catch(err => {
            console.error(err);
            this.$parent.$parent.$parent.modal = {
              name: "explanation",
              data: { error: true },
            };
          });
      },
      getVerseTrans(obj) {
        const url = "http://api.alquran.cloud/v1/ayah/" + obj.surah + ":" + obj.localVerse + "/en." + this.options.translator;
        fetch(url)
          .then(res => res.json())
          .then(res => {
            const text = res.data.text;
            this.$parent.$parent.$parent.modal = {
              name: "trans",
              data: { text, translator: this.options.translator },
            };
          })
          .catch(err => {
            console.error(err);
            this.$parent.$parent.$parent.modal = {
              name: "trans",
              data: { error: true },
            };
          });
      },
      copyText(obj) {
        const text = this.$filters.normalize(obj.text);
        console.log(text);
        navigator.clipboard.writeText(text);
        this.$emit("textCopied");
      },
      highlight(obj, e) {
        let color = null;
        if (e.target.classList.contains("orange")) {
          color = "orange";
        } else if (e.target.classList.contains("purple")) {
          color = "purple";
        } else if (e.target.classList.contains("blue")) {
          color = "blue";
        } else if (e.target.classList.contains("noColor")) {
          color = "noColor";
        }

        // reset classes
        this.options.coords.elm.classList.remove("selected", "orange", "blue", "purple", "noColor");
        // add current selected color
        this.options.coords.elm.classList.add(color);
        obj.color = color; // bind color

        let highlightedVersesArr = JSON.parse(localStorage.getItem("highlightedVerses")) || [];

        if (color === "noColor") {
          console.warn("noColor");
          highlightedVersesArr = highlightedVersesArr.filter(item => item.globalVerse !== obj.globalVerse);
          // update storage
          localStorage.setItem("highlightedVerses", JSON.stringify(highlightedVersesArr));
          return;
        }

        // handle new verse
        const status = highlightedVersesArr.find(item => {
          if (item.globalVerse === obj.globalVerse) {
            item.color = color;
            return true;
          }
          return null;
        });
        if (!status) highlightedVersesArr.push(obj);

        // update storage
        localStorage.setItem("highlightedVerses", JSON.stringify(highlightedVersesArr));
        console.log(highlightedVersesArr);
      },
    },
  };
</script>

<style lang="scss">
  .OptionsRect {
    position: fixed;
    top: 0;
    margin: 0 auto;
    padding: 0 5px;
    display: flex;
    flex-direction: row-reverse;
    width: fit-content;
    background: white;
    color: white;
    border-radius: 3px;
    font-weight: bold;
    font-family: "Tajawal", Helvetica, Arial, sans-serif;
    z-index: 999;
    user-select: none;
    box-shadow: 1px 1px 3px 1px rgba(0, 0, 0, 0.1), -1px -1px 3px 1px rgba(0, 0, 0, 0.1);
    > div {
      display: inline-block;
    }
    button {
      width: 20px;
      height: 20px;
      border-radius: 5px;
      border: 0;
      outline: 0;
      margin: 0;
      background: white;
      padding: 5px;
      position: relative;
      cursor: pointer;
      box-sizing: content-box;
      display: block;
      svg {
        position: absolute;
        pointer-events: none;
        width: 20px;
        height: 20px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #8c8c8c;
      }
      &:hover {
        svg {
          color: #2f70ec;
          transition: fill 0.3s ease;
          transform: translate(-50%, -50%);
        }
      }

      &:active {
        transform: perspective(1px) translateZ(-0.04px);
        transition: 200ms cubic-bezier(0.12, 0.8, 0.32, 1);
      }
    }

    .highlight {
      position: relative;
      padding-right: 5px;
      margin-right: 5px;
      button {
        border-radius: 50%;
        float: right;
        box-sizing: border-box;
        margin: 5px 5px 0 0;
        &.orange {
          background: #ff8214;
        }
        &.purple {
          background: #8b0efe;
        }
        &.blue {
          background: #0671ff;
        }
        &.noColor {
          background: white;
          border: 1px solid #ccc;
          position: relative;
          &::after {
            position: absolute;
            content: "";
            width: 2px;
            height: 100%;
            background: #f94c66;
            left: 50%;
            top: 50%;
            transform: rotate(45deg) translate(-50%, -50%);
            transform-origin: top left;
          }
        }
      }

      &::after {
        position: absolute;
        content: "";
        right: 0;
        top: 50%;
        width: 1px;
        height: calc(100% - 15px);
        background: #e2e2e2;
        transform: translateY(-50%);
      }
    }

    .trans {
    }
    .copyText {
    }
    .explain {
    }
    .sound {
    }
  }
</style>
