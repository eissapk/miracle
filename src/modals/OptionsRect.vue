<template>
  <div class="OptionsRect" :style="{top: coords.top - height + 'px'}">
    <span>1</span>
    <span>2</span>
    <span>3</span>
    <span>4</span>
    <span>5</span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      height: 55
    };
  },
  props: ["coords"]
};
</script>


<style lang="scss">
.OptionsRect {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  margin: 0 auto;
  max-width: 280px;
  background: linear-gradient(90deg, #6a11cb, #2f70ec);
  color: white;
  border-radius: 3px;
  height: 50px;
  font-weight: bold;
  font-family: "Tajawal", Helvetica, Arial, sans-serif;
  z-index: 999;
  user-select: none;
}
</style>