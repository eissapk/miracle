<template>
  <ModalSlot name="tasbih">
    <div class="tasbihInnerWrapper">
      <h3>المسبحة</h3>
      <div>
        <p v-for="(obj, index) in array" :key="index">
          <span class="text">
            {{ obj.text }}
          </span>
          <button @click="handleCounter($event, obj)" class="count o-btn" v-text="$filters.arNum(obj.num)"></button>
          <button @click="reset($event, obj)" class="reset o-btn blue">تصفير</button>
        </p>
      </div>
    </div>
  </ModalSlot>
</template>

<script>
  import ModalSlot from "../components/modalSlot.vue";

  export default {
    components: { ModalSlot },
    data() {
      return {
        array: [
          { text: "سبحان الله", count: 33, num: 0 },
          { text: "الحمد لله", count: 33, num: 0 },
          { text: "الله اكبر", count: 33, num: 0 },
          { text: "اخري", num: 0 },
        ],
      };
    },
    methods: {
      reset(e, obj) {
        obj.num = 0;
        e.target.previousElementSibling.classList.remove("blue");
      },
      handleCounter(e, obj) {
        if (obj.count) {
          if (obj.num < obj.count) obj.num++;
          if (obj.num === obj.count) e.target.classList.add("blue");
        } else {
          obj.num++;
        }
      },
    },
  };
</script>

<style lang="scss">
  .tasbihInnerWrapper {
    h3 {
      margin: 0;
      border-bottom: 2px solid #6a11cb;
      display: inline-block;
      padding-bottom: 5px;
      margin-bottom: 20px;
      color: #333;
    }
    > div {
      p {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        align-items: center;
        justify-items: center;
        color: #666;
        line-height: 30px;
        margin: 20px 0;
        font-size: 18px;
        font-family: "Tajawal", Helvetica, Arial, sans-serif;
        &:first-of-type {
          margin-top: 0;
        }
        .text {
        }
        .count {
          border-radius: 50%;
          width: 40px;
          height: 40px;
          font-size: 18px;
          letter-spacing: 1px;
        }
        .reset {
          font-size: 12px;
          font-family: "Tajawal";
          font-weight: bold;
          float: left;
        }
      }
    }
  }
</style>
