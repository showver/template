<!--
 * @Author: showier
 * @since: 2020-08-25 15:13:58
 * @lastTime: 2020-08-28 10:50:47
 * @LastAuthor: Do not edit
 * @FilePath: \vue-admin-pro\src\App.vue
 * @Description: root主节点
-->
<template>
  <div id="root">
    <router-view/>
  </div>
</template>
<script>

export default {
  name: 'Root',
  created(){
  
  },
  methods:{

  }
}
</script>
<style lang="scss">
#root {
  height: 100%;
  .main-container {
    min-height: 100%;
    -webkit-transition: margin-left 0.28s;
    transition: margin-left 0.28s;
    margin-left: 210px;
    position: relative;
  }
  .hideSidebar{
    .main-container{
      margin-left: 64px;
    }
  }
  .container{
    padding: 15px 30px;
    margin-top: 40px;
  }
}
</style>
