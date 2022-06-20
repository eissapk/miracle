<template>
  <ModalSlot name="explanation">explanation</ModalSlot>

  <!-- <div class="ExplanationModal modal">
    <div class="container">
      <button @click="hideModal()">x</button>
      <p>
        {{ explainer }}
      </p>
      <p>
        {{ text }}
      </p>
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
        explainer: "",
      };
    },
    mounted() {
      this.text = this.$parent.modal.data.text;
      this.explainer = this.$parent.modal.data.explainer;
    },
    methods: {},
  };
</script>
