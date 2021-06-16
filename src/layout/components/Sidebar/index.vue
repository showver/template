<template>
  <div class="sidebar">
    <logo :collapse="isCollapse" />
    <el-menu
      class="sidebar-el-menu"
      :default-active="onRoutes"
      :collapse="isCollapse"
      background-color="#324157"
      text-color="#bfcbd9"
      active-text-color="#20a0ff"
      unique-opened
      router
      @open="handleSelect"
      @close="handleSelect"
    >
      <template v-for="item in menus">
        <template v-if="item.children && item.children.length !== 0">
          <el-submenu
            :key="item.path"
            :index="'/'+item.path"
          >
            <template slot="title">
              <i :class="item.icon" />
              <span slot="title">{{ item.name }}</span>
            </template>
            <template v-for="subItem in item.children">
              <el-submenu
                v-if="subItem.children && subItem.children.length !== 0"
                :key="subItem.path"
                :index="'/'+subItem.path"
              >
                <template slot="title">{{ subItem.name }}</template>
                <template v-for="(threeItem,i) in subItem.children">
                  <template v-if="threeItem.children && threeItem.children.length !== 0">
                    <el-submenu
                      :key="threeItem.path"
                      :index="'/'+threeItem.path"
                    >
                      <template slot="title">
                        {{ threeItem.name }}
                      </template>
                      <el-menu-item
                        v-for="(fourItem,j) in threeItem.children"
                        :key="j"
                        :index="'/'+fourItem.path"
                      >
                        {{ fourItem.name }}
                      </el-menu-item>
                    </el-submenu>
                  </template>
                  <el-menu-item
                    v-else
                    :key="i"
                    :index="'/'+threeItem.path"
                  >
                    {{ threeItem.name }}
                  </el-menu-item>
                </template>
              </el-submenu>
              <el-menu-item
                v-else
                :key="subItem.path"
                :index="'/'+subItem.path"
              >
                {{ subItem.name }}
              </el-menu-item>
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item
            :key="item.path"
            :index="'/'+item.path"
          >
            <i :class="item.icon" />
            <span slot="title">{{ item.name }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import { getMenusAuthInfo } from '@/utils/auth'
export default {
  data() {
    return {
      collapse: false,

      menus: []
    }
  },
  components: {
    Logo
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'projectId'
    ]),
    projectId() {
      return this.$store.state.app.projectId
    },
    onRoutes() {
      return this.$route.path
    },

    isCollapse(path) {


      return !this.sidebar.opened
    }
  },
  watch: {
    // projectId(newV, oldV) {
    //   if (newV && !oldV) {
    //     getMenusAuthInfo().then(value => {
    //       this.menus = JSON.parse(window.sessionStorage.getItem('menuAuths')) || []
    //     })
    //   }

    // }
    //
  },
  created() {
    getMenusAuthInfo().then(value => {
      let arr = JSON.parse(window.sessionStorage.getItem('menuAuths')) || []

      arr.map(e => {
        if (e.path === '/site') {
          e.children = e.children.filter(item => {
            return (item.path === 'site/list' || item.path === 'site/images' || item.path === 'site/alarm')
          })
        }
      })
      this.menus = arr
    })
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log('点击菜单', key, keyPath);


    }
  }
}

</script>

<style lang="scss">
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  bottom: 0;
  overflow-y: scroll;
}

.sidebar::-webkit-scrollbar {
  width: 0;
}

.sidebar-el-menu:not(.el-menu--collapse) {
  width: 100%;
}

.sidebar > ul {
  height: 100%;
}
</style>
