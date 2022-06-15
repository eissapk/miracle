<template>
  <div class="TransModal modal">
    <div class="container">
      <button @click="hideModal()">x</button>
      <p>{{translator}}</p>
      <p>
      {{ text }}
        
      </p>
      trans modal
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      text: "",
      translator: ""
    };
  },
  mounted() {
    this.text = this.$parent.modal.data.text;
    this.translator = this.$parent.modal.data.translator;
    document.body.classList.add("overflow");
  },
  methods: {
    hideModal() {
      this.$el.classList.add("hide");
      setTimeout(() => {
        document.body.classList.remove("overflow");
        this.$el.classList.remove("hide");
        this.$parent.modal = "";
      }, 400);
    },
  },
};
</script>

<style lang="scss">
</style>