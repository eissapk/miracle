<template>
  <ModalSlot name="completion">
    <div class="doneInnerWrapper">
      <!-- resutls -->
      <div class="results">
        <ul class="scrollbar">
          <li v-for="(item, index) of completion" :key="index">
            <span class="time">{{ $filters.arNum(handleDate(item.time)) }}</span>
            <button class="o-btn remove" @click="remove(item)" v-html="closeIcon"></button>
          </li>
          <div class="emptyMsg" v-if="!completion.length">لايوجد ختمات محفوظة</div>
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
        completion: [],
        closeIcon: icons.close,
      };
    },
    beforeMount() {
      this.completion = JSON.parse(localStorage.getItem("completion")) || [];
    },
    methods: {
      handleDate(str) {
        return str.replace(/t.*/gi, "").split("-").reverse().join(" - ");
      },
      remove(obj) {
        oConfirm({
          title: "الختمات",
          desc: "هل تريد حذف هذه الختمة؟",
          btns: { cancel: { exists: true, text: "الغاء" }, okay: { text: "نعم" } },
        }).then(res => {
          if (res) {
            this.completion = this.completion.filter(item => item.id !== obj.id);
            localStorage.setItem("completion", JSON.stringify(this.completion));
          }
        });
      },
    },
  };
</script>

<style lang="scss">
  .doneInnerWrapper {
    width: 100%;
    min-height: 70px;
    margin-top: 5px;
    border-radius: 3px;
    border: 1px solid #d8d8d8;

    .results {
      ul {
        margin: 0;
        padding: 10px;
        list-style-type: none;
        overflow: auto;
        height: calc(100vh - 120px);
        .emptyMsg {
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
            border-color: transparent;
            background: #ff7272;
            float: left;
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

          .time {
            pointer-events: none;
            user-select: none;
            float: right;
            color: #666;
            letter-spacing: 2px;
            font-weight: bold;
            line-height: 35px;
            font-family: "Tajawal", Helvetica, Arial, sans-serif;
          }
        }
      }
    }
  }
</style>
