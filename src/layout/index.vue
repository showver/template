<!--
 * @Author: showier
 * @since: 2020-08-25 17:08:44
 * @lastTime: 2020-08-25 17:33:55
 * @LastAuthor: Do not edit
 * @FilePath: \vue-admin-pro\src\layout\index.vue
 * @Description: 
-->
<template>
  <div
    :class="classObj"
    class="root-wrapper"
  >
    <sidebar class="sidebar-container"></sidebar>
    <div class="main-container">
      <div class="fixed-header">
        <navbar />
        <div
          class="nav-box"
          v-if="menus.length !==0"
        >
          <div
            class="item-box"
            v-for="(item,index) in menus"
            :key="index"
            :class="activeIndex==index ? 'active' :''"
            @click="handleClick(item.path,index)"
          >{{item.name}}</div>

        </div>
      </div>
      <app-main></app-main>
    </div>
  </div>
</template>
<script>
import { Sidebar, Navbar, AppMain, Nav } from './components'

import { mapState } from 'vuex'
export default {
  name: 'Layout',
  components: {
    Sidebar,
    Navbar,
    AppMain,

  },
  data() {
    return {
      menus: [],
      activeIndex: 0,
    }
  },
  created() {
    if (JSON.parse(sessionStorage.getItem('projectData'))) {
      this.menus = JSON.parse(sessionStorage.getItem('projectData'))


      let arr = []
      this.menus.map(e => {

        if (this.$route.path === '/' + e.path) {
          arr.push(e)
        }
      
      })
      if (arr.length == 0) {
        this.menus = []
      } else {
        this.menus = JSON.parse(sessionStorage.getItem('projectData'))
      }
      // this.menus = JSON.parse(sessionStorage.getItem('projectData'))
    }
    if (sessionStorage.getItem('activeIndex')) {
      this.activeIndex = sessionStorage.getItem('activeIndex')
    }

  },
  watch: {
    $route(to, from) {
      this.menus = JSON.parse(sessionStorage.getItem('projectData'))
      let arr = []
      this.menus.map(e => {
        if (to.path === '/' + e.path) {
          arr.push(e)
        }
      })
      if (arr.length == 0) {
        this.activeIndex = 0
        this.menus = []
      } else {

        this.menus = JSON.parse(sessionStorage.getItem('projectData'))
      }

    },
    type(newV, oldV) {

      setTimeout(() => {
        this.menus = JSON.parse(sessionStorage.getItem('projectData'))
      }, 300)

      // this.$router.push({ path: '/' + this.menus[0].path })

      // }

    }
  },
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar,
      device: state => state.app.device
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    },

    type() {
      return this.$store.state.app.type
    }

  },
  methods: {
    handleClick(path, index) {
      this.activeIndex = index
      sessionStorage.setItem('activeIndex', index)
      this.$router.push({ path: "/" + path })
    }
  }

}
</script>
<style lang="scss">
.root-wrapper {
  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - 210px);
    transition: width 0.28s;
    margin-bottom: 40px;
    .nav-box {
      display: flex;
      width: 100%;
      height: 45px;
      // background: red;
      background: #ffffff;
      box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

      align-items: center;
      .item-box {
        margin-left: 30px;
        cursor: pointer;
        line-height: 45px;
      }
      .active {
        color: #409eff;
        border-bottom: 2px solid #409eff;
      }
    }
  }
}
</style>