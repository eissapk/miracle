<template>
  <ModalSlot name="settings">
    <div class="settingsInnerWrapper">
      <h3>الاعدادات</h3>
      <div class="content">
        <label class="darkMode">
          <input @click="toggleMode" type="checkbox" class="o-switch-btn" ref="dark" />
          الوضع الليلى
        </label>
      </div>
    </div>
  </ModalSlot>
</template>

<script>
  import ModalSlot from "../components/modalSlot.vue";

  export default {
    components: { ModalSlot },
    data() {
      return {};
    },
    mounted() {
      const isDark = JSON.parse(localStorage.getItem("isDark"));
      if (isDark) {
        if (this.$refs.dark) this.$refs.dark.checked = true;
      } else {
        if (this.$refs.dark.checked) this.$refs.dark.checked = false;
      }
    },
    methods: {
      toggleMode(e) {
        const isChecked = e.target.checked;
        if (isChecked) {
          localStorage.setItem("isDark", true);
          document.body.classList.add("dark");
        } else {
          localStorage.setItem("isDark", false);
          document.body.classList.remove("dark");
        }
      },
    },
  };
</script>
<style lang="scss">
  .settingsInnerWrapper {
    h3 {
      margin: 0;
      border-bottom: 2px solid #6a11cb;
      display: inline-block;
      padding-bottom: 5px;
      margin-bottom: 20px;
      color: #333;
    }
    .content {
      .darkMode {
        display: block;
        line-height: 45px;
        font-family: "Tajawal", Helvetica, Arial, sans-serif;
        font-size: 12px;
        font-weight: bold;
        color: #666;
        -webkit-user-select: none;
        -moz-user-select: none;
        user-select: none;
        input {
          transform: scale(1.3);
          margin: 10px 10px 0 15px;
          float: right;
        }
      }
    }
  }
</style>
