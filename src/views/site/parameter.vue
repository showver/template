<!--
 * @Author: showier
 * @Date: 2021-04-14 09:14:26
 * @LastEditTime: 2021-04-30 11:42:28
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \admin-template\src\views\site\parameter.vue
-->
<template>
  <div>
    <el-row :gutter="30">
        <el-col :span="4">
            <Select />
        </el-col>
      <el-col :span="5">
        <el-input v-model="tabelForm.fieldName" maxlength="20" show-word-limit placeholder="请输入字段名称"></el-input>
      </el-col>
        <el-col :span="10">
            <el-button type="primary" @click="fetchData">查询</el-button>
            <el-button type="primary" @click="handleReset">重置</el-button>
            <el-button type="primary" @click="handleAdd" :disabled="!$isBtnAuth('projectInfo:add')">新增</el-button>
            <el-button type="warning" @click="fetchTrigger">{{this.triggerType=='1'?'关闭触发':'触发'}}</el-button>
        </el-col>
    </el-row>

    <!-- 列表 -->
    <el-table :data="tableData">
        <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
        <el-table-column label="字段名称" align="center" prop="fieldName" sortable></el-table-column>
        <el-table-column label="字段含义" align="center" prop="fieldMeaning"></el-table-column>
        <el-table-column label="单位" align="center" prop="company"></el-table-column>
        <el-table-column label="表名称" align="center" prop="pressureTableName" sortable></el-table-column>
        <el-table-column label="排序值" align="center" prop="sortValue" sortable></el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDele(scope.$index, scope.row)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    <div class="page">
      <el-pagination :total="tableTotal" :current-page="tabelForm.page" :page-size="tabelForm.rows" @current-change="handleCurrentChange" @size-change="handleSizeChange" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
    </div>

    <!-- 模态框 -->
    <el-dialog :title="dialogMap[dialogStatus]" :visible.sync="dialogVisible" :show-close="false" :close-on-click-modal="false" style="width:900px;margin:0 auto;">
      <el-form ref="dialogForm" :model="dialogForm" :rules="dialogRules" label-width="140px">
        <el-form-item label="字段名称" prop="fieldName">
          <el-input v-model="dialogForm.fieldName" maxlength="20" show-word-limit placeholder="请输入字段名称"></el-input>
        </el-form-item>
        <el-form-item label="字段含义" prop="fieldMeaning">
          <el-input v-model="dialogForm.fieldMeaning" maxlength="50" show-word-limit placeholder="请输入字段含义"></el-input>
        </el-form-item>
        <el-form-item label="单位" prop="company">
          <el-input v-model="dialogForm.company" maxlength="10" show-word-limit placeholder="请输入单位"></el-input>
        </el-form-item>
        <el-form-item label="排序值" prop="sortValue">
          <el-input v-model="dialogForm.sortValue" maxlength="10" show-word-limit placeholder="请输入排序值"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogStatus === 'create' ? createData() : updateData()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getSiteParameter, postSiteParameter, putSiteParameter, deleSiteParameter, getTableInfo, getTrigger, getSiteInfo } from '@/api/site'
import Select from '@/components/projectSelect'
export default {
  components: {
    Select
  },
  data() {
    return {
      triggerType: null,
      // 设备表ID
      tableInfoId: null,
      tableData: [],
      tableTotal: 0,
      tabelForm: {
        page: 1,
        rows: 10,
        fieldName: '',
        pressureSiteId: Number(this.$store.state.app.projectId)
      },
      dialogVisible: false,
      dialogStatus: 'create',
      dialogMap: {
        update: '编辑',
        create: '新增'
      },
      dialogForm: {
        fieldName: null,
        fieldMeaning: null,
        company: null,
        sortValue: null
      },
      dialogRules: {
        fieldName: [{ required: true, message: '字段名称不能为空', trigger: 'blur' }],
        fieldMeaning: [{ required: true, message: '字段含义不能为空', trigger: 'blur' }],
        sortValue: [{ required: true, message: '排序值不能为空', trigger: 'blur' }],
      },
    }
  },
  created() {
    this.fetchData()
    this.fetchSiteInfo()
    this.fetchTableInfo()
  },
  computed: {
    pressureSiteId() {
      return this.$store.state.app.projectId
    }
  },
  watch: {
    pressureSiteId(newV, oldV) {
      this.tabelForm.pressureSiteId = newV;
      this.fetchData()
      this.fetchTableInfo()
    }
  },
  methods: {
    handleReset() {
      this.tabelForm = {
        page: 1,
        rows: 10,
        fieldName: '',
        pressureSiteId: this.pressureSiteId
      }
      this.fetchData()
    },
    handleAdd() {
      this.$nextTick(() => {
        if (this.$refs['dialogForm'] !== undefined) {
          this.$refs['dialogForm'].resetFields()
        }
      })
      this.dialogStatus = 'create'
      this.dialogVisible = true
    },
    handleEdit(index, row) {
      this.dialogForm = row
      this.dialogStatus = 'update'
      this.dialogVisible = true
    },
    handleDele(index, row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.removeData(row.id)
      })
    },
    handleCurrentChange(val) {
      this.tabelForm.page = val
      this.fetchData()
    },
    handleSizeChange(val) {
      this.tabelForm.rows = val
      this.fetchData()
    },
    createData() {
      this.$refs['dialogForm'].validate((valid) => {
        if (valid) {
          const params = {
            ...this.dialogForm,
            tableInfoId: this.tableInfoId
          } 
          postSiteParameter(params).then((data) => {
                this.dialogVisible = false
                this.fetchData()
                this.$message.success('新增成功')
            })
        }
      })
    },
    updateData() {
      this.$refs['dialogForm'].validate((valid) => {
        if (valid) {
          const params = {
            ...this.dialogForm,
            tableInfoId: this.tableInfoId
          } 
          putSiteParameter(params).then((data) => {
              this.dialogVisible = false
              this.fetchData()
              this.$message.success('更新成功')
          })
        }
      })
    },
    fetchData() {
      getSiteParameter(this.tabelForm).then((data) => {
        this.tableData = data.rows
        this.tableTotal = data.total
      })
    },
    fetchTableInfo() {
        getTableInfo({pressureSiteId: this.pressureSiteId}).then((data) => {
            this.tableInfoId = data.id
        })
    },
    removeData(id) {
      deleSiteParameter(id).then((data) => {
        this.fetchData()
        this.$message.success('删除成功')
      })
    },
    fetchSiteInfo() {
      getSiteInfo({pressureSiteId: this.pressureSiteId}).then((data) => {
        this.triggerType = data.rows[0].triggerType
      })
    },
    fetchTrigger() {
      const params = {
        pressureSiteId: this.pressureSiteId,
        triggerType: this.triggerType=='1' ? 0 : 1
      }
      getTrigger(params).then((data) => {
        this.triggerType = this.triggerType=='1' ? 0 : 1
        this.$message.success('操作成功')
      })
    },
  }
}
</script>
<style lang="scss" scoped>
</style>
