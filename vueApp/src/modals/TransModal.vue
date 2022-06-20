<template>
  <ModalSlot name="trans">trans</ModalSlot>

  <!-- <div class="TransModal modal">
    <div class="container">
      <button @click="hideModal()">x</button>
      <p>{{ translator }}</p>
      <p>
        {{ text }}
      </p>
      trans modal
    </div>
  </div> -->
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
      this.text = this.$parent.modal.data.text;
      this.translator = this.$parent.modal.data.translator;
    },
    methods: {},
  };
</script>

<style lang="scss"></style>
