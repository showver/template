<!--
 * @Author: showier
 * @Date: 2021-04-14 09:14:26
 * @LastEditTime: 2021-04-20 13:46:49
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \admin-template\src\views\site\images.vue
-->
<template>
  <div>
    <el-row :gutter="30">
        <el-col :span="4">
            <Select />
        </el-col>
        <el-col :span="10">
            <el-button type="primary" @click="handleAdd" :disabled="!$isBtnAuth('projectInfo:add')">新增</el-button>
        </el-col>
    </el-row>

    <!-- 列表 -->
    <el-table :data="tableData">
      <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
      <el-table-column label="参数类型名称" prop="equipmentName"></el-table-column>
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
        <el-form-item label="参数类型名称" prop="equipmentName">
          <el-input v-model="dialogForm.equipmentName" maxlength="20" show-word-limit placeholder="请输入参数类型"></el-input>
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
import { getSiteEquipment, postSiteEquipment, putSiteEquipment, deleSiteEquipment } from '@/api/site'
import Select from '@/components/projectSelect'
export default {
  components: {
    Select
  },
  data() {
    return {
      tableData: [],
      tableTotal: 0,
      tabelForm: {
        page: 1,
        rows: 10,
        pressureSiteId: Number(this.$store.state.app.projectId)
      },
      dialogVisible: false,
      dialogStatus: 'create',
      dialogMap: {
        update: '编辑',
        create: '新增'
      },
      dialogForm: {
        equipmentName: null
      },
      dialogRules: {
        equipmentName: [
          { required: true, message: '请填写参数类型名称', trigger: 'change' }
        ]
      },
    }
  },
  created() {
    this.fetchData()
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
    }
  },
  methods: {
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
      this.dialogForm = Object.assign({}, row)
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
            equipmentName: this.dialogForm.equipmentName,
            pressureSiteId: this.pressureSiteId
          } 
          postSiteEquipment(params).then((data) => {
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
            id: this.dialogForm.id,
            equipmentName: this.dialogForm.equipmentName,
            pressureSiteId: this.pressureSiteId
          } 
          putSiteEquipment(params).then((data) => {
              this.dialogVisible = false
              this.fetchData()
              this.$message.success('更新成功')
          })
        }
      })
    },
    fetchData() {
      getSiteEquipment(this.tabelForm).then((data) => {
        this.tableData = data.rows
        this.tableTotal = data.total
      })
    },
    removeData(id) {
      deleSiteEquipment(id).then((data) => {
        this.fetchData()
        this.$message.success('删除成功')
      })
    },
  }
}
</script>
<style lang="scss" scoped>
</style>
