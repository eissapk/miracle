<template>
  <div class="searchModal modal">
    <div class="container">
      <button @click="hideModal()">x</button>
      search modal
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    document.body.classList.add("overflow");
  },
  methods: {
    hideModal() {
      this.$el.classList.add("hide");
      setTimeout(() => {
        document.body.classList.remove("overflow");
        this.$el.classList.remove("hide");
        this.$parent.modal = "";
      }, 500);
    },
  },
};
</script>