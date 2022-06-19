<template>
  <div class="modal">
    <div class="container">
      <nav>
        <button class="o-btn close" @click="hideModal()"></button>
      </nav>
      <div class="content scrollbar">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ["name"],
    data() {
      return {};
    },
    mounted() {
      console.log("mounted " + this.name + " Slot");
      document.body.classList.add("overflow");
    },
    unmounted() {
    },
    methods: {
      hideModal() {
        this.$el.classList.add("hide");
        setTimeout(() => (this.$parent.$parent.modal = { name: "", data: null }), 400);
      },
    },
  };
</script>
