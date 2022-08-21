<template>
  <div class="home">
    <!-- read -->
    <div class="read tab">
      <router-link :to="'/read/' + lastRead.page" class="router-link"></router-link>
      <img src="img/book.png" alt="book" />
      <p class="lastRead">
        <span class="icon" v-html="bookIcon"></span>
        اخر قراءة
      </p>
      <p class="surah">سُورَةُ {{lastRead.name}}</p>
      <p class="progress">
        <p class="percent" v-text="$filters.arNum(percent) + '%'"></p>
        <p class="bar">
          <span :style="{width: percent + '%'}"></span>
        </p>
      </p>
      <button v-if="percent === 100" @click="saveCompletion()" class="saveCompletion o-btn">احفظ الختمة</button>
    </div>
    
    <!-- search -->
    <div class="search tab">
      <a class="router-link" @click="showModal('search')"></a>
      <p>
        <span class="icon" v-html="searchIcon"></span>
        <span class="text">بحث</span>
      </p>
    </div>
    
    <!-- bookmarks -->
    <div class="bookmarks tab">
      <a class="router-link" @click="showModal('bookmarks')"></a>
      <p>
        <span class="icon" v-html="bookmarkIcon"></span>
        <span class="text">المفضلة</span>
      </p>
    </div>
    
    <!-- doaa -->
    <div class="doaa tab">
      <a class="router-link" @click="showModal('doaa')"></a>
      <p>
        <span class="icon" v-html="azkarIcon"></span>
        <span class="text">دعاء ختم القرآن</span>
      </p>
    </div>
    
    <!-- اذكار -->
    <div class="azkar tab">
      <a class="router-link" @click="showModal('azkar')"></a>
      <p>
        <span class="icon" v-html="azkarIcon"></span>
        <span class="text">اذكار</span>
      </p>
    </div>
    
    <!-- تسبيح -->
    <div class="tasbih tab">
      <a class="router-link" @click="showModal('tasbih')"></a>
      <p>
        <span class="icon" v-html="tasbihIcon"></span>
        <span class="text">تسبيح</span>
      </p>
    </div>
    
    <!-- ختمات -->
    <div class="completion tab">
      <a class="router-link" @click="showModal('completion')"></a>
      <p>
        <span class="icon" v-html="bookIcon"></span>
        <span class="text">الختمات</span>
      </p>
    </div>

    
    <!-- settings -->
    <!-- <div class="settings tab">
      <a class="router-link" @click="showModal('settings')"></a>
      <p>
        <span class="icon" v-html="settingsIcon"></span>
        <span class="text">الاعدادات</span>
      </p>
    </div> -->

  </div>
</template>

<script>
import solid_book_open from "olum-icons/dist/fa/solid_book_open";
import solid_search from "olum-icons/dist/fa/solid_search";
import solid_bookmark from "olum-icons/dist/fa/solid_bookmark";
import solid_hands from "olum-icons/dist/fa/solid_hands";
import solid_cog from "olum-icons/dist/fa/solid_cog";
import icons from "../services/icons";

export default {
  data() {
    return {
      bookIcon: solid_book_open,
      bookmarkIcon: solid_bookmark,
      searchIcon: solid_search,
      azkarIcon: solid_hands,
      settingsIcon: solid_cog,
      tasbihIcon: icons.tasbih,
      percent: 0,
      lastRead: null,
    };
  },
  created() {
    const lastRead = JSON.parse(localStorage.getItem("lastRead")) || {
      juz: 1,
      page: 1,
      name: "ٱلْفَاتِحَةِ",
      type: "mec",
      surah: 1,
      verses: 7,
    };
    this.lastRead = lastRead;
  },
  mounted() {
    this.percent = Math.floor((this.lastRead.page / 604) * 100);
    // stop audio
    const audioInstance = this.$parent.$parent.audioInstance;
    audioInstance.src = ""; 
  },
  methods: {
    saveCompletion() {
      // set storage of completion
      const arr = JSON.parse(localStorage.getItem("completion")) || [];
      const obj = {id: new Date().getTime(), time: new Date().toISOString()}
      arr.push(obj);
      localStorage.setItem("completion", JSON.stringify(arr));
      // reset
      this.percent = 0;
      const lastRead = {juz: 1,page: 1,name: "ٱلْفَاتِحَةِ",type: "mec",surah: 1,verses: 7};
      localStorage.setItem("lastRead", JSON.stringify(lastRead));
      this.lastRead = lastRead;
    },
    showModal(name) {
      this.$parent.$parent.modal = { name };
    },
  },
};
</script>

<style lang="scss">
.home {
  display: grid;
  grid-gap: 10px;
  user-select: none;
  .tab {
    position: relative;
    padding: 10px;
    border-radius: 5px;
    color: white;
    background: linear-gradient(90deg, #6a11cb, #2f70ec);
    cursor: pointer;
  }

  .read {
    grid-row: 1/2;
    grid-column: 1/3;
    * {
      pointer-events: none;
    }
    > p {
      margin: 0;
      margin-bottom: 10px;
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
      font-size: 18px;
      font-family: "Kitab-Regular2" !important;
    }

    .progress {
      width: calc(100% - 150px);
      .percent {
        margin: 0;
        margin-bottom: 5px !important;
        font-weight: bold;
        font-family: "Tajawal", Helvetica, Arial, sans-serif;
        letter-spacing: 2px;
      }
      .bar {
        position: relative;
        height: 5px;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 5px;
        span {
          position: absolute;
          right: 0;
          top: 0;
          width: 0;
          height: 100%;
          background: white;
          border-radius: 5px;
          transition: width 0.3s ease-in-out;
        }
      }
    }
    .saveCompletion,.doaa {
      pointer-events: initial !important;
      padding-left: 10px;
      padding-right: 10px;
      font-weight: bold;
      font-family: "Tajawal", Helvetica, Arial, sans-serif;
      position: relative;
      z-index: 1;
      font-size: 12px;
      color: #666;
      line-height: 35px;
      margin-left: 5px;
      &:last-of-type {
        margin-left: 0px;
      }
      &:active{
        color: white;
      }
    }
  }

  .bookmarks,
  .search ,.completion,.azkar,.tasbih,.settings,.doaa{
    padding: 15px 10px;
    p {
      font-weight: bold;
      margin: 0;
      .icon {
        float: right;
        margin-left: 10px;
        svg {
          width: 20px;
          height: 20px;
          fill: white;
          display: block;
        }
      }
      .text {
        vertical-align: sub;
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
  
    .doaa {
    grid-row: 3/4;
    grid-column: 1/3;
  }
  
    .azkar {
    grid-row: 4/5;
    grid-column: 1/2;
  }
  
  .tasbih {
    grid-row: 4/5;
    grid-column: 2/3;
  }

  .completion {
    grid-row: 5/6;
    grid-column: 1/3;
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