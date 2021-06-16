<!--
 * @Author: showier
 * @Date: 2020-12-30 11:22:43
 * @LastEditTime: 2021-05-20 16:27:25
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \Y-admin\yilong\src\components\projectSelect\index.vue
-->
<template>
    <div class="select-box">
      <el-dropdown
        trigger="click"
        @command="handleClick"
      >
        <span class="el-dropdown-link projectName">
          {{projectInfo.pressureSiteName}}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">

          <el-dropdown-item
            icon="el-icon-plus"
            v-for="(item,index) in projectData"
            :key="index"
            :command="item"
          >{{item.pressureSiteName}}</el-dropdown-item>

        </el-dropdown-menu>
      </el-dropdown>

    </div>
</template>

<script>
import { getSiteInfo ,getProjectRegionList} from '@/api/site'
export default {
  data() {
    return {
      projectName: '',
      projectData: [],
      projectInfo: {},
      regionList:[],
         regionProps: {
        value: 'id',
        label: 'regionName'
      },
    }
  },
  created() {
    if (sessionStorage.getItem('projectName')) {
      this.projectName = sessionStorage.getItem('projectName')
    }
    this.getProjectInfoData()
    // this.getProjectRegionListData()
  },
  methods: {
    getProjectInfoData() {
      let params = {
        page: 1,
        rows: 500
      }
      getSiteInfo(params).then(res => {
        this.projectData = res.rows
         this.projectData.map(e=>{
          if(e.id === Number(this.$store.state.app.projectId)){
            this.projectInfo = e
          }
        })
       
      })
    },
     getProjectRegionListData() {
      getProjectRegionList().then(res => [
        this.regionList = res
      ])
    },
    handleClick(row) {
      // console.log('sfdfd',item); 
      this.projectName = row.pressureSiteName
      this.projectInfo= row
      sessionStorage.setItem('projectId', row.id)
      this.$store.dispatch('app/getProjectId', row.id)
      sessionStorage.setItem('projectName', row.pressureSiteName)
    }
  }
}
</script>

<style>
.select-box {
  cursor: pointer;
}
</style>