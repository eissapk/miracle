<template>
  <div class="home">
    <!-- read -->
    <div class="read tab">
      <router-link :to="'/read/' + page" class="router-link"></router-link>
      <img src="../assets/book.png" alt="book" />
      <p class="lastRead">
        <span class="icon" v-html="solid_book_open"></span>
        اخر قراءة
      </p>
      <p class="surah">الفاتحة</p>
      <p class="progress">
        <p class="percent" v-arNum>{{percent + "%"}}</p>
        <p class="bar">
          <span :style="{width: percent + '%'}"></span>
        </p>
      </p>
      <button v-if="percent === 100" @click="saveCompletion()" class="saveCompletion">احفظ الختمة</button>
    </div>
    
    <!-- search -->
    <div class="search tab">
      <router-link to="/search" class="router-link"></router-link>
      <p>
        <span class="icon" v-html="solid_search"></span>
        بحث
      </p>
    </div>
    
    <!-- bookmarks -->
    <div class="bookmarks tab">
      <router-link to="/bookmarks" class="router-link"></router-link>
      <p>
        <span class="icon" v-html="solid_bookmark"></span>
        المفضلة
      </p>
    </div>

  </div>
</template>

<script>
import solid_book_open from "olum-icons/dist/fa/solid_book_open";
import solid_bookmark from "olum-icons/dist/fa/solid_bookmark";
import solid_search from "olum-icons/dist/fa/solid_search";

export default {
  data() {
    return {
      solid_book_open,
      solid_bookmark,
      solid_search,
      percent: 0,
      page: 1,
    };
  },
  mounted() {
    const page = JSON.parse(localStorage.getItem("lastRead")) || 1;
    this.page = page;
  },
  methods: {
    saveCompletion() {
      console.log("saveCompletion");
    },
  },
};
</script>

<style lang="scss">
.home {
  display: grid;
  grid-gap: 10px;
  .tab {
    position: relative;
    padding: 10px;
    border-radius: 5px;
    color: white;
    background: linear-gradient(90deg, #6a11cb, #2f70ec);
  }

  .read {
    grid-row: 1/2;
    grid-column: 1/3;
    * {
      pointer-events: none;
    }
    > p {
      margin-bottom: 20px !important;
    }

    > img {
      position: absolute;
      left: 10px;
      bottom: 10px;
      width: auto;
      height: calc(100% - 60px);
    }

    .lastRead {
      .icon {
        display: inline-block;
        margin-left: 5px;
        vertical-align: middle;
        svg {
          float: right;
          width: 20px;
          fill: white;
        }
      }
      font-weight: bold;
    }

    .surah {
      font-weight: bold;
    }

    .progress {
      width: calc(100% - 160px);
      .percent {
        margin-bottom: 5px !important;
        font-weight: bold;
      }
      .bar {
        position: relative;
        height: 5px;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 5px;
        span {
          position: absolute;
          left: 0;
          top: 0;
          width: 0;
          height: 100%;
          background: white;
          border-radius: 5px;
          transition: width 0.3s ease-in-out;
        }
      }
    }
    .saveCompletion {
      pointer-events: initial !important;
      background: #fff;
      padding: 10px 15px 5px;
      color: #666;
      border: none;
      outline: none;
      box-shadow: none;
      border-radius: 3px;
      cursor: pointer;
      font-weight: bold;
      position: relative;
      z-index: 1;
      &:active {
        transform: perspective(1px) translateZ(-0.04px);
        transition: 200ms cubic-bezier(0.12, 0.8, 0.32, 1);
      }
      &:focus {
        box-shadow: 0 0 0px 2px #e87d1f;
      }
    }
  }

  .bookmarks,
  .search {
    padding: 15px 10px;
    p {
      font-weight: bold;
      .icon {
        display: inline-block;
        margin-left: 5px;
        vertical-align: middle;
        svg {
          float: right;
          width: 20px;
          fill: white;
        }
      }
    }
  }
  .search {
    grid-row: 2/3;
    grid-column: 1/2;
  }

  .bookmarks {
    grid-row: 2/3;
    grid-column: 2/3;
  }

  .router-link {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: transparent;
    text-decoration: none;
    pointer-events: initial !important;
    outline: none;
    box-shadow: none;
    border: none;
  }
}
</style>