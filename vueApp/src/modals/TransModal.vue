<template>
  <ModalSlot name="trans">
    <div>
      <h3>
        {{ translator }}
      </h3>
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
      if (this.$parent.modal.name === "trans") {
        this.text = this.$parent.modal.data.text;
        this.translator = this.$parent.modal.data.translator;
      }
    },
    methods: {},
  };
</script>

<style lang="scss"></style>
