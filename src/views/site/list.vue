<!--
 * @Author: showier
 * @since: 2020-09-01 13:46:54
 * @lastTime: 2020-09-03 10:18:51
 * @LastAuthor: Do not edit
 * @FilePath: \vue-admin-pro\src\views\site\list.vue
 * @Description: 站点信息管理
-->
<template>
  <div>
    <el-row :gutter="30">
      <el-col :span="5">
        <el-input v-model="tabelForm.pressureSiteName" maxlength="20" show-word-limit placeholder="请输入监测站点名称"></el-input>
      </el-col>
      <el-col :span="5">
        <el-input v-model="tabelForm.gatewayGrm" maxlength="20" show-word-limit placeholder="请输入网关账户"></el-input>
      </el-col>
      <el-col :span="10">
        <el-button type="primary" @click="fetchSite">搜索</el-button>
        <el-button type="primary" @click="handleReset">重置</el-button>
        <el-button type="primary" @click="handleAdd" :disabled="!$isBtnAuth('projectInfo:add')">新增</el-button>
      </el-col>
    </el-row>

    <!-- 列表 -->
    <el-table :data="tableData">
      <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
      <el-table-column label="监测站点名称" align="center" prop="pressureSiteName" sortable></el-table-column>
      <el-table-column label="所属地区" align="center" prop="pressureSiteAddress" sortable></el-table-column>
      <el-table-column label="网关状态" align="center" prop="gatewayStatus" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <span v-if="row.gatewayStatus=='0'" style="color: green;">在线</span>
          <span v-else style="color: red;">不在线</span>
        </template>
      </el-table-column>
      <el-table-column label="网关账户" align="center" prop="gatewayGrm" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column label="网关密码" align="center" prop="gatewayPass" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column label="排序值" align="center" prop="sortValue" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column width="300" label="操作">
        <template slot-scope="{row}">
          <el-button type="info" size="mini" plain @click="handleMain(row)" :disabled="!$isBtnAuth('projectInfo:main')">站点维护</el-button>
          <el-button type="primary" size="mini" plain @click="handleEdit(row)" :disabled="!$isBtnAuth('projectInfo:edit')">编辑</el-button>
          <el-button type="danger" size="mini" plain @click="handleDele(row)" :disabled="!$isBtnAuth('projectInfo:del')">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page">
      <el-pagination :total="tableTotal" :current-page="tabelForm.page" :page-size="tabelForm.rows" @current-change="handleCurrentChange" @size-change="handleSizeChange" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
    </div>

    <!-- 模态框 -->
    <el-dialog :title="dialogMap[dialogStatus]" :visible.sync="dialogVisible" :show-close="false" :close-on-click-modal="false" style="width:900px;margin:0 auto;">
      <el-form ref="dialogForm" :model="dialogForm" :rules="dialogRules" label-width="140px">
        <el-form-item label="监测站点名称" prop="pressureSiteName">
          <el-input v-model="dialogForm.pressureSiteName" maxlength="20" show-word-limit placeholder="请输入监测站点名称"></el-input>
        </el-form-item>
        <el-form-item label="管道地址" prop="pressureSiteAddress">
          <el-input v-model="dialogForm.pressureSiteAddress" maxlength="50" show-word-limit placeholder="请输入管道地址"></el-input>
        </el-form-item>
        <el-form-item label="网关账户" prop="gatewayGrm">
          <el-input v-model.trim="dialogForm.gatewayGrm" maxlength="20" show-word-limit placeholder="请输入网关账户"></el-input>
        </el-form-item>
        <el-form-item label="网关密码" prop="gatewayPass">
          <el-input type="password" v-model.trim="dialogForm.gatewayPass" maxlength="20" show-word-limit placeholder="请输入网关密码"></el-input>
        </el-form-item>
        <el-form-item label="经度" prop="longitude">
          <el-input v-model.trim="dialogForm.longitude" maxlength="20" show-word-limit placeholder="请输入经度"></el-input>
        </el-form-item>
        <el-form-item label="纬度" prop="latitude">
          <el-input v-model.trim="dialogForm.latitude" maxlength="20" show-word-limit placeholder="请输入纬度"></el-input>
        </el-form-item>
        <el-form-item label="排序值" prop="sortValue">
          <el-input type="number" v-model.trim="dialogForm.sortValue" maxlength="10" show-word-limit placeholder="请输入排序值"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogStatus === 'create' ? createSite() : updateSite()">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>

import { getSiteInfo, postSiteInfo, putSiteInfo, deleSiteInfo } from '@/api/site'
import EXIF from 'exif-js'
import qs from 'qs'
import { getToken } from '@/utils/auth.js'
import { getMenusAuthInfo } from '../../utils/auth'
export default {
  data() {
    return {
      api: process.env.VUE_APP_BASE_API,
      tableData: [],
      tableTotal: null,
      tabelForm: {
        page: 1,
        rows: 10,
        pressureSiteName: null,
        gatewayGrm: null,
      },
      menus: [],
      projectId: '',
      // 模态框
      dialogVisible: false,
      dialogStatus: 'create',
      dialogMap: {
        create: '新增',
        update: '编辑'
      },
      dialogForm: {
        pressureSiteName: "",
        pressureSiteAddress: "",
        gatewayGrm: "",
        gatewayPass: "",
        sortValue: "",
        latitude: "",
        longitude: "",
      },
      dialogRules: {
        pressureSiteName: [{ required: true, message: '监测站点名称不能为空', trigger: 'blur' }],
        pressureSiteAddress: [{ required: true, message: '管道地址不能为空', trigger: 'blur' }],
        gatewayGrm: [{ required: true, message: '网关账号不能为空', trigger: 'blur' }],
        gatewayPass: [{ required: true, message: '网关密码不能为空', trigger: 'blur' }],
        latitude: [{ required: true, message: '纬度不能为空', trigger: 'blur' }],
        longitude: [{ required: true, message: '经度不能为空', trigger: 'blur' }]
      },
    }
  },
  computed: {
    id() {  
      return this.$store.state.app.projectId
    }
  },
  watch: {
    id(newV, oldV) {
      console.log(newV, oldV);
      getMenusAuthInfo().then(value => {
        console.log('232323', value);
        this.menus = JSON.parse(sessionStorage.getItem('projectData'))
        this.$router.push({ path: '/' + this.menus[0].path })
      })
    }
  },
  created() {
    this.fetchSite()
    if (JSON.parse(sessionStorage.getItem('projectData'))) {
      this.menus = JSON.parse(sessionStorage.getItem('projectData'))
      console.log('this.menus-----', this.menus);
    }
  },
  methods: {
    // 助手函数
    handleMain(row) {
      sessionStorage.setItem('projectId', row.id)
      this.$store.dispatch('app/getProjectId', row.id)
      sessionStorage.setItem('projectName', row.pressureSiteName)
      sessionStorage.setItem('projectName', row.pressureSiteName)
      // this.$store.dispatch('app/getType', this.type)
      if (JSON.parse(sessionStorage.getItem('projectData'))) {
        this.menus = JSON.parse(sessionStorage.getItem('projectData'))
        this.$router.push({ path: '/' + this.menus[0].path })
      }
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
    handleEdit(row) {
      this.dialogForm = row
      this.dialogStatus = 'update'
      this.dialogVisible = true
    },
    handleDele(row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.removeSite(row.id)
      })
    },
    handleReset() {
      this.tabelForm = {
        page: 1,
        rows: 10,
        pressureSiteName: null,
        gatewayGrm: null,
      }
      this.fetchSite()
    },
    handleCurrentChange(val) {
      this.tabelForm.page = val
      this.fetchSite()
    },
    handleSizeChange(val) {
      this.tabelForm.page = 1
      this.tabelForm.rows = val
      this.fetchSite()
    },
    // 网络请求
    createSite() {
      this.$refs['dialogForm'].validate((valid) => {
        if (valid) {
          postSiteInfo(this.dialogForm).then(res => {
            this.dialogVisible = false
            this.fetchSite()
            this.$message.success('新增成功')
          })
        }
      })
    },
    updateSite() {
      this.$refs['dialogForm'].validate((valid) => {
        if (valid) {
          putSiteInfo(this.dialogForm).then(res => {
            this.dialogVisible = false
            this.fetchSite()
            this.$message.success('修改成功')
          })
        }
      })
    },
    removeSite(id) {
      deleSiteInfo(id).then(() => {
        this.fetchSite()
        this.$message.success('删除成功')
      })
    },
    fetchSite() {
      getSiteInfo(this.tabelForm).then(res => {
        this.tableData = res.rows
        this.tableTotal = res.total
      })
    }
  }
}
</script>
<style lang="scss">
</style>