<!--
 * @Author: showier
 * @Date: 2021-04-14 14:35:44
 * @LastEditTime: 2021-04-28 19:36:27
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \admin-template\src\views\site\field.vue
-->
<template>
  <div>
    <el-row :gutter="30">
        <el-col :span="4">
            <Select />
        </el-col>
        <el-col :span="3">
            <el-select v-model="tabelForm.equipmentTypeId" placeholder="请选择参数类型">
                <el-option v-for="(item, index) in equipmentList" :key="index" :label="item.equipmentName" :value="item.id"></el-option>
            </el-select>
        </el-col>
        <el-col :span="3">
            <el-select v-model="tabelForm.alarmType" placeholder="请选择告警类型">
                <el-option label="无告警" value="0"></el-option>
                <el-option label="状态值告警" value="1"></el-option>
                <el-option label="浮点值告警" value="2"></el-option>
            </el-select>
        </el-col>
      <el-col :span="4">
        <el-input v-model="tabelForm.fieldName" maxlength="32" show-word-limit placeholder="请输入字段名称"></el-input>
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
        <el-table-column label="参数类型" prop="equipmentName"></el-table-column>
        <el-table-column label="字段名称" prop="fieldName" sortable></el-table-column>
        <el-table-column label="字段含义" prop="fieldMeaning"></el-table-column>
        <el-table-column label="显示折线图" align="center" prop="displayLineChart" sortable>
          <template slot-scope="{row}">
            <span v-if="row.displayLineChart">是</span>
            <span v-else>否</span>
          </template>
        </el-table-column>
        <el-table-column label="告警类型" align="center" prop="alarmType">
          <template slot-scope="{row}">
            <span v-if="row.alarmType===0">无告警</span>
            <span v-else-if="row.alarmType==1">状态值告警</span>
            <span v-else>浮点值告警</span>
          </template>
        </el-table-column>
        <el-table-column label="状态值" align="center" prop="statusAlarmValue" sortable></el-table-column>
        <el-table-column label="最小值" align="center" prop="minWaringValue" sortable></el-table-column>
        <el-table-column label="最大值" align="center" prop="maxWaringValue" sortable></el-table-column>
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
    <el-scrollbar style="height:700px;">
      <el-dialog :title="dialogMap[dialogStatus]" :visible.sync="dialogVisible" :show-close="false" :close-on-click-modal="false" style="width:1000px;margin:0 auto;">
        <el-form ref="dialogForm" :model="dialogForm" :rules="dialogRules" label-width="140px">
          <el-form-item label="参数类型" prop="equipmentTypeId">
            <el-select v-model="dialogForm.equipmentTypeId" placeholder="请选择参数类型">
              <el-option v-for="(item, index) in equipmentList" :key="index" :label="item.equipmentName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="请求参数" prop="siteParameterId">
            <el-select v-model="dialogForm.siteParameterId" placeholder="请选择请求参数">
              <el-option v-for="(item, index) in parameterList" :key="index" :label="item.fieldName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="告警类型" prop="alarmType">
            <el-radio v-model="dialogForm.alarmType" :label="0">无告警</el-radio>
            <el-radio v-model="dialogForm.alarmType" :label="1">状态值告警</el-radio>
            <el-radio v-model="dialogForm.alarmType" :label="2">浮点值告警</el-radio>
          </el-form-item>
          <el-form-item v-if="dialogForm.alarmType===1" label="状态值" prop="statusAlarmValue">
            <el-input v-model="dialogForm.statusAlarmValue" maxlength="20" show-word-limit placeholder="请输入状态值"></el-input>
          </el-form-item>
          <el-form-item v-if="dialogForm.alarmType===2" label="最小值" prop="minWaringValue">
            <el-input v-model="dialogForm.minWaringValue" maxlength="10" show-word-limit placeholder="请输入最小值"></el-input>
          </el-form-item>
          <el-form-item v-if="dialogForm.alarmType===2" label="最大值" prop="maxWaringValue">
            <el-input v-model="dialogForm.maxWaringValue" maxlength="10" show-word-limit placeholder="请输入最大值"></el-input>
          </el-form-item>
          <el-form-item label="是否显示折线图" prop="displayLineChart">
            <el-radio v-model="dialogForm.displayLineChart" :label="false">否</el-radio>
            <el-radio v-model="dialogForm.displayLineChart" :label="true">是</el-radio>
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
    </el-scrollbar>
    
  </div>
</template>
<script>
import { getSiteField, postSiteField, putSiteField, deleSiteField, getSiteEquipment, getSiteParameter } from '@/api/site'
import Select from '@/components/projectSelect'
export default {
  components: {
    Select
  },
  data() {
    return {
      equipmentList: [],
      parameterList: [],
      tableData: [],
      tableTotal: 0,
      tabelForm: {
        page: 1,
        rows: 10,
        pressureSiteId: Number(this.$store.state.app.projectId),
        equipmentTypeId: null,
        fieldName: null,
        alarmType: null
      },
      dialogVisible: false,
      dialogStatus: 'create',
      dialogMap: {
        update: '编辑',
        create: '新增'
      },
      dialogForm: {
        alarmType: null,
        displayLineChart: false,
        equipmentTypeId: null,
        siteParameterId: null,
        statusAlarmValue: null,
        minWaringValue: null,
        maxWaringValue: null,
        sortValue: null,
      },
      dialogRules: {
        equipmentTypeId: [{ required: true, message: '请选择参数类型', trigger: 'blur' }],
        siteParameterId: [{ required: true, message: '请选择请求参数', trigger: 'blur' }],
        sortValue: [{ required: true, message: '排序值不能为空', trigger: 'blur' }],
      },
    }
  },
  created() {
    this.fetchData()
    this.fetchEquipment()
    this.fetchParameter()
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
      this.fetchEquipment()
      this.fetchParameter()
    }
  },
  methods: {
    handleReset() {
      this.tabelForm = {
        page: 1,
        rows: 10,
        pressureSiteId: this.pressureSiteId,
        equipmentTypeId: null,
        fieldName: null,
        alarmType: null
      }
      this.fetchData()
    },
    handleAdd() {
      this.dialogForm = {
        alarmType: null,
        displayLineChart: false,
        equipmentTypeId: null,
        siteParameterId: null,
        statusAlarmValue: null,
        minWaringValue: null,
        maxWaringValue: null,
        sortValue: null,
      }
      this.dialogStatus = 'create'
      this.dialogVisible = true
    },
    handleEdit(index, row) {
      this.dialogForm = {
          ...row,
          alarmType: Number(row.alarmType),
          displayLineChart: Boolean(row.displayLineChart),
      }
      console.log(this.dialogForm);
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
            displayLineChart: Boolean(this.dialogForm.displayLineChart),
            statusAlarmValue: this.dialogForm.alarmType == 1 ? Number(this.dialogForm.statusAlarmValue) : null,
            minWaringValue: this.dialogForm.alarmType == 2 ? Number(this.dialogForm.minWaringValue) : null,
            maxWaringValue: this.dialogForm.alarmType == 2 ? Number(this.dialogForm.maxWaringValue) : null,
          } 
          postSiteField(params).then((data) => {
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
            displayLineChart: Boolean(this.dialogForm.displayLineChart),
            statusAlarmValue: this.dialogForm.alarmType == 1 ? Number(this.dialogForm.statusAlarmValue) : null,
            minWaringValue: this.dialogForm.alarmType == 2 ? Number(this.dialogForm.minWaringValue) : null,
            maxWaringValue: this.dialogForm.alarmType == 2 ? Number(this.dialogForm.maxWaringValue) : null,
          } 
          putSiteField(params).then((data) => {
              this.dialogVisible = false
              this.fetchData()
              this.$message.success('更新成功')
          })
        }
      })
    },
    fetchData() {
      getSiteField(this.tabelForm).then((data) => {
        this.tableData = data.rows
        this.tableTotal = data.total
      })
    },
    removeData(id) {
      deleSiteField(id).then((data) => {
        this.fetchData()
        this.$message.success('删除成功')
      })
    },
    fetchEquipment() {
      getSiteEquipment(this.tabelForm).then((data) => {
        this.equipmentList = data.rows
      })
    },
    fetchParameter() {
      getSiteParameter(this.tabelForm).then((data) => {
        this.parameterList = data.rows
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
