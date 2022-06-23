<template>
  <ModalSlot name="trans">
    <div class="transInnerWrapper">
      <h3>{{ translator }} translation</h3>
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
        translator: "",
      };
    },
    mounted() {
      console.log("mounted trans");
      const transObj = {
        ahmedraza: "Ahmed raza",
      };
      if (this.$parent.modal.name === "trans") {
        this.text = this.$parent.modal.data.text;
        this.translator = this.$parent.modal.data.translator;
        this.translator = transObj[this.translator];
      }
    },
    methods: {},
  };
</script>

<style lang="scss">
  .transInnerWrapper {
    direction: ltr;
    text-align: left;
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
