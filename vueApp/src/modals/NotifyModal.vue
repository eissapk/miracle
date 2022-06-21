<template>
  <div class="NotifyModal">{{ desc }}</div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: ["desc"],
};
</script>


<style lang="scss">
.NotifyModal {
  position: fixed;
  top: 10px;
  left: 0;
  right: 0;
  margin: 0 auto;
  display: block;
  max-width: 280px;
  text-align: center;
  background: linear-gradient(90deg, #6a11cb, #2f70ec);
  color: white;
  border-radius: 3px;
  padding: 10px 0 5px;
  font-weight: bold;
  font-family: "Tajawal", Helvetica, Arial, sans-serif;
  z-index: 99999;
  line-height: initial;
  animation: notifySlideToDown 0.3s ease-in-out forwards;
  user-select: none;
  &.alert {
    background: #5fd068;
  }
  &.error {
    background: #f94c66;
  }
}
@keyframes notifySlideToDown {
  from {
    top: -100px;
  }
  to {
    top: 10px;
  }
}
</style>