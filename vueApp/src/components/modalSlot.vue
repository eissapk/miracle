<template>
  <div class="modal">
    <div class="container" ref="container">
      <nav ref="nav">
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
          setTimeout(() => (this.$parent.$parent.modal = { name: "", data: null }), 200);
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
        let threshold = Math.round(window.innerHeight / 3);
        const nav = this.$refs.nav;
        const container = this.$refs.container;
        if (!nav || !container) return;

        nav.ontouchstart = dragStart;
        nav.onmousedown = dragStart;
        function dragStart(e) {
          nav.classList.add("addLayer");
          e.stopPropagation();
          isDown = true;
          e = e || window.event;
          console.warn(e);
          if (e.type.includes("mouse")) startY = e.clientY;
          else startY = Math.round(e.touches[0].clientY);

          nav.addEventListener("mousemove", dragMove);
          nav.addEventListener("mouseup", dragEnd);
          nav.addEventListener("mouseleave", reset);
          nav.addEventListener("touchmove", dragMove);
          nav.addEventListener("touchend", dragEnd);

          function reset() {
            nav.classList.remove("addLayer");
            isDown = false;

            if (distance >= threshold && direction === "bottom") {
              container.classList.remove("pauseAnimation");
              $this.hideModal();
            } else if (distance < threshold) {
              container.style.transform = "translate3d(0,5vh,0)";
            }

            nav.removeEventListener("touchmove", dragMove);
            nav.removeEventListener("touchend", dragEnd);
            nav.removeEventListener("mousemove", dragMove);
            nav.removeEventListener("mouseup", dragEnd);
          }

          function dragEnd() {
            reset();
          }

          function dragMove(e) {
            e = e || window.event;
            if (isDown) {
              if (e.type.includes("mouse")) currentX = e.clientY;
              else currentX = Math.round(e.touches[0].clientY);
              // get direction
              walkY = currentX - startY;
              if (walkY > 0) direction = "bottom";
              else direction = "top";
              distance = walkY < 0 ? walkY * -1 : walkY;
              console.warn({ distance, direction });
              if (distance <= threshold && direction === "bottom") {
                if (!container.classList.contains("pauseAnimation")) container.classList.add("pauseAnimation");
                container.style.transform = `translate3d(0,calc(5vh + ${walkY}px), 0)`;
              }
            }
          }
        }
      },
    },
  };
</script>
