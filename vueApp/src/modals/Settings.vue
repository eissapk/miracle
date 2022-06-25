<template>
  <ModalSlot name="settings">
    <div class="settingsInnerWrapper">
      <h3>الاعدادات</h3>
      <div>
        <!-- <p v-for="(text, index) in array" :key="index" v-html="$filters.highlight(text, godArr, 'god')"></p> -->
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
        godArr: ["اللهم", "لله", "الله", "رب", "ربهم", "ربكم", "ربك", "ربه", "ربنا", "لرب", "ربي", "ربها", "لربك", "ربكما", "ربهما", "ربها"],
        array: [],
      };
    },
    methods: {},
  };
</script>
<style lang="scss">
  .settingsInnerWrapper {
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
        color: #666;
        margin: 0;
        line-height: 30px;
        margin-top: 10px;
        font-size: 18px;
        font-family: "Tajawal", Helvetica, Arial, sans-serif;
      }
    }
  }
</style>
