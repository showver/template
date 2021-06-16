<!--
 * @Author: showier
 * @since: 2020-08-26 14:34:32
 * @lastTime: 2020-08-31 09:26:24
 * @LastAuthor: Do not edit
 * @FilePath: \vue-admin-pro\src\views\back\operate-log.vue
 * @Description: 后台-操作日志
-->
<template>
  <div class="back-operate-log">
    <div class="form">
      <el-form inline>
        <el-form-item>
          <el-input v-model="form.username" maxlength="20" show-word-limit placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="模块类型">
          <el-select v-model="form.systemModuleEnum" placeholder="请选择模块类型">
            <el-option v-for="(value, key, index) in systemModuleEnum" :key="index" :value="key" :label="value">{{ value }}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker v-model="form.startTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择开始时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker v-model="form.endTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择结束时间"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button type="primary" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 列表 -->
    <el-table border :data="tableData">
      <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
      <el-table-column label="用户名" width="140" prop="username" sortable></el-table-column>
      <el-table-column label="描述" width="140" prop="operation"></el-table-column>
      <el-table-column label="方法名称" width="400" prop="method"></el-table-column>
      <el-table-column label="参数" prop="params"></el-table-column>
      <el-table-column label="操作时间" width="180" prop="operatingTime" sortable></el-table-column>
    </el-table>
    <div class="page">
      <el-pagination :total="tableTotal" :current-page="form.page" :page-size="form.rows" @current-change="handleCurrentChange" @size-change="handleSizeChange" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
    </div>
  </div>
</template>
<script>
  import { getOperateLog } from '@/api/back'
  export default {
    data() {
      return {
        systemModuleEnum: {
          'SYSTEM': '系统类记录'
        },
        tableData: [],
        tableTotal: 0,
        form: {
          page: 1,
          rows: 10,
          username: null,
          startTime: null,
          endTime: null,
          systemModuleEnum: null
        }
      }
    },
    created() {
      this.fetchOperateLog()
    },
    methods: {
      resetForm() {
        this.form = {
          page: 1,
          rows: 10,
          username: null,
          startTime: null,
          endTime: null
        }
      },
      handleReset() {
        this.resetForm()
        this.fetchOperateLog()
      },
      handleSearch() {
        const start = +new Date(this.form.startTime)
        const end = +new Date(this.form.endTime)
        if (start > end) {
          this.$message.error('开始时间应小于结束时间')
          return
        }
        this.fetchOperateLog()
      },
      handleCurrentChange(val) {
        this.form.page = val
        this.fetchOperateLog()
      },
      handleSizeChange(val) {
        this.form.rows = val
        this.form.page = 1
        this.fetchOperateLog()
      },
      fetchOperateLog() {
        getOperateLog(this.form).then(data => {
          const { total, rows } = data
          this.tableData = rows || []
          this.tableTotal = total || 0
        })
      }
    }
  }
</script>