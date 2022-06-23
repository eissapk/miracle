<template>
  <ModalSlot name="explanation">
    <div class="explanationInnerWrapper">
      <h3>تفسير {{ explainer }}</h3>
      <p>{{ text }}</p>
    </div>
  </ModalSlot>
</template>

<script>
  import ModalSlot from "../components/modalSlot.vue";

  export default {
    components: { ModalSlot },

    data() {
      return {
        text: "",
        explainer: "",
      };
    },
    mounted() {
      console.log("mounted explanation");
      const transObj = {
        muyassar: "الميسر",
        jalalayn: "الجلالين",
      };
      if (this.$parent.modal.name === "explanation") {
        this.text = this.$parent.modal.data.text;
        this.explainer = this.$parent.modal.data.explainer;
        this.explainer = transObj[this.explainer];
      }
    },
    methods: {},
  };
</script>

<style lang="scss">
  .explanationInnerWrapper {
    h3 {
      margin: 0;
      border-bottom: 2px solid #6a11cb;
      display: inline-block;
      padding-bottom: 5px;
      margin-bottom: 20px;
      color: #333;
    }
    p {
      color: #666;
      margin: 0;
      line-height: 25px;
    }
  }
</style>
