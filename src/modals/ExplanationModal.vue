<template>
  <div class="ExplanationModal modal">
    <div class="container">
      <button @click="hideModal()">x</button>
      <p>
        {{ explainer }}
      </p>
      <p>
        {{ text }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      text: "",
      explainer: "",
    };
  },
  mounted() {
    this.text = this.$parent.modal.data.text;
    this.explainer = this.$parent.modal.data.explainer;
    document.body.classList.add("overflow");
  },
  methods: {
    hideModal() {
      document.body.classList.remove("overflow");
      this.$el.classList.add("hide");
      setTimeout(() => {
        this.$el.classList.remove("hide");
        this.$parent.modal = "";
      }, 400);
    },
  },
};
</script>

<style lang="scss">
</style>