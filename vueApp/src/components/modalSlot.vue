<template>
  <div class="modal">
    <div class="container" ref="container">
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
    props: ["name", "hide"],
    data() {
      return {};
    },
    mounted() {
      console.log("mounted " + this.name + " Slot");
      document.body.classList.add("overflow");
      this.enableSwipe();
    },
    unmounted() {
      document.body.classList.remove("overflow");
    },
    watch: {
      hide() {
        if (this.name === "bookmark" && this.hide) this.hideModal();
      },
    },
    methods: {
      hideModal() {
        if (this.$el) {
          this.$el.classList.add("hide");
          setTimeout(() => (this.$parent.$parent.modal = { name: "", data: null }), 400);
        }
      },
      enableSwipe() {
        const $this = this;
        var isDown;
        var startY;
        var currentX;
        var walkY;
        let direction;
        let distance;
        let threshold = 150;
        const container = this.$refs.container;
        if (!container) return;

        container.ontouchstart = dragStart;
        function dragStart(e) {
          e.stopPropagation();
          isDown = true;
          e = e || window.event;
          startY = Math.round(e.touches[0].clientY);
          container.addEventListener("touchmove", dragMove);
          container.addEventListener("touchend", dragEnd);

          function dragEnd() {
            // reset
            isDown = false;

            if (distance >= threshold && direction === "bottom") {
              container.classList.remove("pauseAnimation");
              $this.hideModal();
            } else if (distance < threshold) {
              container.style.top = "5vh"; // reset
            }

            container.removeEventListener("touchmove", dragMove);
            container.removeEventListener("touchend", dragEnd);
          }

          function dragMove(e) {
            e = e || window.event;
            if (isDown) {
              currentX = Math.round(e.touches[0].clientY);
              // get direction
              walkY = currentX - startY;
              if (walkY > 0) direction = "bottom";
              else direction = "top";
              distance = walkY < 0 ? walkY * -1 : walkY;
              console.warn({ distance, direction });
              if (distance <= threshold && direction === "bottom") {
                if (!container.classList.contains("pauseAnimation")) container.classList.add("pauseAnimation");
                container.style.top = `calc(5vh + ${walkY}px)`;
              }
            }
          }
        }
      },
    },
  };
</script>
