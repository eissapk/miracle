<template>
  <ModalSlot name="explanation">
    <div>
      <h3>
        {{explainer}}
      </h3>
      <p>{{text}}</p>
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
      if (this.$parent.modal.name === "explanation") {
        this.text = this.$parent.modal.data.text;
        this.explainer = this.$parent.modal.data.explainer;
      }
    },
    methods: {},
  };
</script>
