<template>
  <div class="OptionsRect" :style="{ top: options.coords.top - height + 'px' }">
    <div class="highlight" @click="highlight(options.obj, $event), hide()">
      <button class="orange"></button>
      <button class="purple"></button>
      <button class="blue"></button>
    </div>
    <div class="trans">
      <button
        @click="getVerseTrans(options.obj), hide()"
        v-html="solid_language"
      ></button>
    </div>
    <div class="copyText">
      <button
        @click="copyText(options.obj), hide()"
        v-html="solid_copy"
      ></button>
    </div>
    <div class="explain">
      <button
        @click="getVerseExplanation(options.obj), hide()"
        v-html="solid_book_open"
      ></button>
    </div>
    <div class="sound">
      <button
        @click="reciteVerse(options.obj), hide()"
        v-html="solid_play_circle"
      ></button>
      <!-- <button>auto</button> -->
    </div>
  </div>
</template>

<script>
import solid_language from "olum-icons/dist/fa/solid_language";
import solid_copy from "olum-icons/dist/fa/solid_copy";
import solid_book_open from "olum-icons/dist/fa/solid_book_open";
import solid_play_circle from "olum-icons/dist/fa/solid_play_circle";
export default {
  data() {
    return {
      solid_language,
      solid_copy,
      solid_book_open,
      solid_play_circle,
      height: 40,
    };
  },
  mounted() {
    // blur
    document.body.addEventListener("click", (e) => {
      if (e.target !== this.$el && e.target !== this.options.coords.elm) {
        this.hide();
      }
    });
  },
  props: ["options", "audio"],
  methods: {
    hide() {
      this.$emit("hide");
    },
    reciteVerse(obj) {
      const rate = 64;
      const url =
        "https://cdn.islamic.network/quran/audio/" +
        rate +
        "/ar." +
        this.options.reciter +
        "/" +
        obj.globalVerse +
        ".mp3";
      this.audio.src = url;
      this.audio.play();
      this.audio.onended = () => {
        console.log("ended");
        this.$emit("update", {
          isPlaying: false,
          isInitialPlaying: true,
        });
      };
      this.$emit("update", {
        isPlaying: true,
        isInitialPlaying: true,
      });
    },
    getVerseExplanation(obj) {
      const url =
        "http://api.alquran.cloud/ayah/" +
        obj.surah +
        ":" +
        obj.localVerse +
        "/editions/ar." +
        this.options.explainer;
      fetch(url)
        .then((res) => res.json())
        .then((res) => {
          const text = res.data[0].text;
          this.$parent.$parent.$parent.modal = {
            name: "explanation",
            data: { text, explainer: this.options.explainer },
          };
        })
        .catch((err) => {
          console.error(err);
          this.$parent.$parent.$parent.modal = {
            name: "explanation",
            data: { error: true },
          };
        });
    },
    getVerseTrans(obj) {
      const url =
        "http://api.alquran.cloud/v1/ayah/" +
        obj.surah +
        ":" +
        obj.localVerse +
        "/en." +
        this.options.translator;
      fetch(url)
        .then((res) => res.json())
        .then((res) => {
          const text = res.data.text;
          this.$parent.$parent.$parent.modal = {
            name: "trans",
            data: { text, translator: this.options.translator },
          };
        })
        .catch((err) => {
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
      }

      console.log(color, obj);
    },
  },
};
</script>

<style lang="scss">
.OptionsRect {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  margin: 0 auto;
  padding: 0 10px;
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
  box-shadow: 1px 1px 3px 1px rgba(0, 0, 0, 0.1),
    -1px -1px 3px 1px rgba(0, 0, 0, 0.1);

  > div {
    display: inline-block;
  }
  button {
    width: 25px;
    height: 25px;
    border-radius: 5px;
    border: 0;
    outline: 0;
    margin: 5px;
    background: white;
    padding: 0;
    position: relative;
    margin-top: 8px;
    cursor: pointer;
    svg {
      position: absolute;
      pointer-events: none;
      width: 20px;
      height: 20px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      fill: #8c8c8c;
    }
    &:hover {
      svg {
        fill: #2f70ec;
        transition: fill 0.3s ease;
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
      &.orange {
        background: #ff8214;
      }
      &.purple {
        background: #8b0efe;
      }
      &.blue {
        background: #0671ff;
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