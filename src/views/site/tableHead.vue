<!--
 * @Author: showier
 * @Date: 2021-04-14 09:14:26
 * @LastEditTime: 2021-04-27 14:07:45
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \admin-template\src\views\site\tableHead.vue
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
        </el-col>
    </el-row>

    <!-- 列表 -->
    <el-table :data="tableData">
      <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
      <el-table-column label="字段名称" prop="fieldName"></el-table-column>
      <el-table-column label="字段含义" prop="fieldMeaning"></el-table-column>
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
        <el-form-item label="表头字段" prop="siteFieldId">
          <el-select v-model="dialogForm.siteFieldId" placeholder="请选择字段">
            <el-option v-for="(item, index) in fieldList" :key="index" :label="item.fieldName" :value="item.id"></el-option>
          </el-select>
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
import { getSiteTableHead, postSiteTableHead, putSiteTableHead, deleSiteTableHead, getSiteField } from '@/api/site'
import Select from '@/components/projectSelect'
export default {
  components: {
    Select
  },
  data() {
    return {
      fieldList: [],
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
        pressureSiteId: Number(this.$store.state.app.projectId),
        siteFieldId: null
      },
      dialogRules: {
        siteFieldId: [{ required: true, message: '请选择表头字段', trigger: 'blur' }]
      },
    }
  },
  created() {
    this.fetchData()
    this.fetchField()
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
      this.fetchField()
    }
  },
  methods: {
    handleReset() {
      this.tabelForm = {
        page: 1,
        rows: 10,
        pressureSiteId: this.pressureSiteId
      }
      this.fetchData()
    },
    handleAdd() {
      this.dialogForm = {
        pressureSiteId: this.pressureSiteId,
        siteFieldId: null
      },
      this.dialogStatus = 'create'
      this.dialogVisible = true
    },
    handleEdit(index, row) {
      console.log(row)
      this.dialogForm = {
        id: row.id,
        siteFieldId: row.siteFieldId,
        pressureSiteId: this.pressureSiteId
      }
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
      console.log(this.dialogForm);
      console.log(this.fieldList);
      this.$refs['dialogForm'].validate((valid) => {
        if (valid) {
          postSiteTableHead(this.dialogForm).then((data) => {
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
            siteFieldId: this.dialogForm.siteFieldId,
            pressureSiteId: this.pressureSiteId
          } 
          putSiteTableHead(params).then((data) => {
              this.dialogVisible = false
              this.fetchData()
              this.$message.success('更新成功')
          })
        }
      })
    },
    fetchData() {
      getSiteTableHead(this.tabelForm).then((data) => {
        this.tableData = data.rows
        this.tableTotal = data.total
      })
    },
    fetchField() {
      getSiteField(this.tabelForm).then((data) => {
        this.fieldList = data.rows
      })
    },
    removeData(id) {
      deleSiteTableHead(id).then((data) => {
        this.fetchData()
        this.$message.success('删除成功')
      })
    },
  }
}
</script>
<style lang="scss" scoped>
</style>
