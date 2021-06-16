<!--
 * @Author: your name
 * @Date: 2021-04-28 19:17:58
 * @LastEditTime: 2021-05-10 17:50:41
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \sifangjin-admin\src\views\site\alarm.vue
-->
<template>
  <div>
    <el-row :gutter="30">
        <el-col :span="4">
            <el-select v-model="tabelForm.timeType" placeholder="请选择时间">
                <el-option label="7天" :value="1"></el-option>
                <el-option label="30天" :value="2"></el-option>
                <el-option label="日" :value="3"></el-option>
                <el-option label="周" :value="4"></el-option>
                <el-option label="月" :value="5"></el-option>
            </el-select>
        </el-col>
        <el-col :span="10">
            <el-button type="primary" @click="fetchData">查询</el-button>
            <el-button type="primary" @click="handleReset">重置</el-button>
        </el-col>
    </el-row>

    <!-- 列表 -->
    <el-table :data="tableData">
      <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
      <el-table-column label="监测站点名称" align="center" prop="pressureSiteName" sortable></el-table-column>
      <el-table-column label="告警内容" align="center" prop="alarmInfo"></el-table-column>
      <el-table-column label="告警值" align="center" prop="alarmValue" sortable>
        <template slot-scope="{row}">
            <span>{{row.alarmValue}} {{row.company}}</span>
        </template>
      </el-table-column>
      <el-table-column label="阀值" align="center" prop="minWaringValue" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
            <span>{{row.minWaringValue}} {{row.company}} - {{row.maxWaringValue}} {{row.company}}</span>
        </template>
      </el-table-column>
      <el-table-column label="告警开始时间" align="center" prop="alarmTime" sortable></el-table-column>
      <el-table-column label="告警恢复时间" align="center" prop="recoveryTime" sortable></el-table-column>
    </el-table>
    <div class="page">
      <el-pagination :total="tableTotal" :current-page="tabelForm.page" :page-size="tabelForm.rows" @current-change="handleCurrentChange" @size-change="handleSizeChange" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
    </div>
  </div>
</template>
<script>

import { getAlarm } from '@/api/site'
export default {
  data() {
    return {
      tableData: [],
      tableTotal: null,
      tabelForm: {
        page: 1,
        rows: 10,
        alarmType: 4,
        timeType: null,
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    handleReset() {
      this.tabelForm = {
        page: 1,
        rows: 10,
        alarmType: 4,
        timeType: null,
      }
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.tabelForm.page = val
      this.fetchData()
    },
    handleSizeChange(val) {
      this.tabelForm.page = 1
      this.tabelForm.rows = val
      this.fetchData()
    },
    fetchData() {
      getAlarm(this.tabelForm).then(res => {
        this.tableData = res.rows
        this.tableTotal = res.total
      })
    }
  }
}
</script>
<style lang="scss">
</style>
