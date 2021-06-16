<!--
 * @Author: showier
 * @since: 2020-08-26 14:30:19
 * @lastTime: 2020-09-29 10:13:05
 * @LastAuthor: Do not edit
 * @FilePath: \toncentsoft-et\src\views\back\user.vue
 * @Description: 后台-用户
-->
<template>
  <div class="back-user">
    <div class="form">
      <el-form inline>
        <el-form-item>
          <el-input v-model="form.roleName" maxlength="20" show-word-limit placeholder="请输入角色名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="form.username" maxlength="20" show-word-limit placeholder="请输入账号名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button type="primary" @click="handleReset">重置</el-button>
          <el-button :disabled="!$isBtnAuth('user:add')" type="primary" @click="handleNew">新增</el-button>
          <el-button type="primary" @click="handleTemp" :disabled="!$isBtnAuth('user:exportTemplate')">模板下载</el-button>
          <el-button :disabled="!$isBtnAuth('user:exportData')" type="primary" @click="handleExport">数据导出</el-button>
          <el-button type="primary" class="file-btn" :disabled="!$isBtnAuth('user:import')">
            <input ref="file" type="file" class="file-type" @change="handleFile" />数据导入
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-row>
      <el-col :span="24">
        <div class="table">
          <el-table :data="tableData">
            <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
            <el-table-column label="姓名" prop="name" sortable></el-table-column>
            <el-table-column label="账号名称" prop="username" sortable></el-table-column>
            <el-table-column label="账号角色" prop="roleName" align="center"></el-table-column>
            <el-table-column label="性别" width="70" prop="sex" align="center">
              <template slot-scope="{ row }">{{ sexEnum[row.sex] }}</template>
            </el-table-column>
            <el-table-column label="状态" width="80" prop="status" align="center">
              <template slot-scope="{ row }">
                <span :style="{color: statusEnum[row.status].color}">{{ statusEnum[row.status].label }}</span>
              </template>
            </el-table-column>
            <el-table-column label="后台权限" width="100" prop="backStage" align="center" sortable>
              <template slot-scope="{ row }">
                <span>{{ backStageData[row.backStage] }}</span>
              </template>
            </el-table-column>
            <el-table-column label="报表权限" width="100" prop="reportDownload" align="center" sortable>
              <template slot-scope="{ row }">
                <span>{{ reportDownloadData[row.reportDownload] }}</span>
              </template>
            </el-table-column>
            <el-table-column label="过期时间" width="120" prop="expirationTime" align="center"></el-table-column>
            <el-table-column label="账户类型" width="100" prop="accountType" align="center">
              <template slot-scope="{ row }">{{ accountTypeEnum[row.accountType] }}</template>
            </el-table-column>
            <el-table-column label="手机号码" prop="telephone" align="center"></el-table-column>
            <el-table-column width="350" label="操作">
              <template slot-scope="{ row }">
                <el-button type="info" size="small" plain @click="handleRelevance(row)" :disabled="row.identity === 1001">关联站点</el-button>
                <el-button :disabled="!$isBtnAuth('user:edit')" type="primary" size="small" plain @click="handleEdit(row)">编辑</el-button>
                <el-button :disabled="!$isBtnAuth('user:dele')" type="danger" size="small" plain @click="handleDelete(row)">删除</el-button>
                <el-button type="warning" size="small" plain @click="handleResetPwd(row)">重置密码</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-row class="page-margin">
          <el-col :span="24" class="toolbar">
            <el-pagination class="page" :current-page="form.page" :page-sizes="[10, 20, 30, 40]" :page-size="form.rows" layout="total, sizes, prev, pager, next, jumper" :total="tableTotal" style="float:right;" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
          </el-col>
        </el-row>
      </el-col>
    </el-row>

    <!-- 模态框 -->
    <el-dialog :title="dialogMap[dialogStatus]" :visible.sync="dialogVisible" :show-close="false" :close-on-click-modal="false" style="width:900px;height:100%;:center;margin:0 auto;">
      <el-form ref="dialogForm" :model="dialogForm" :rules="dialogRules" label-width="140px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model.trim="dialogForm.name" maxlength="20" show-word-limit placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="dialogForm.sex" placeholder="请选择">
            <el-option v-for="(value, key, index) in sexEnum" :key="index" :label="value" :value="Number(key)">{{ value }}</el-option>
          </el-select>
          <!-- <el-radio v-model="dialogForm.sex" v-for="(value, key, index) in sexEnum" :key="index" :label="value" :value="Number(key)">{{ value }}</el-radio> -->
        </el-form-item>
        <el-form-item label="手机号码" prop="telephone">
          <el-input v-model="dialogForm.telephone" maxlength="11" show-word-limit placeholder="请输入手机号码"></el-input>
        </el-form-item>
        <el-form-item label="账号角色" prop="roleId">
          <el-select v-model="dialogForm.roleId" placeholder="请选择角色">
            <el-option v-for="(item, index) in roleOption" :key="index" :label="item.name" :value="item.id">{{ item.name }}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账号名称" prop="username">
          <el-input v-model.trim="dialogForm.username" maxlength="20" show-word-limit placeholder="请输入账号名称"></el-input>
        </el-form-item>
        <el-form-item label="账户类型" prop="accountType">
          <el-select v-model="dialogForm.accountType" placeholder="请选择">
            <el-option v-for="(value, key, index) in accountTypeEnum" :key="index" :label="value" :value="Number(key)">{{ value }}</el-option>
          </el-select>
          <!-- <el-radio v-model="dialogForm.accountType" v-for="(value, key, index) in accountTypeEnum" :key="index" :label="value" :value="key">{{ value }}</el-radio> -->
        </el-form-item>
        <el-form-item v-if="dialogForm.accountType==1" label="到期时间" prop="expirationTime">
          <el-date-picker v-model="dialogForm.expirationTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择到期时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="dialogForm.status" placeholder="请选择状态">
            <el-option v-for="(value, key, index) in statusEnum" :key="index" :label="value.label" :value="Number(key)">{{ value.label }}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="后台管理表权限" prop="backStage">
          <el-select v-model="dialogForm.backStage" placeholder="请选择">
            <el-option v-for="(value, key, index) in backStageData" :key="index" :label="value" :value="Number(key)">{{ value }}</el-option>
          </el-select>
          <!-- <el-radio v-model="dialogForm.backStage" v-for="(value, key, index) in backStageData" :key="index" :label="value" :value="Number(key)">{{ value }}</el-radio> -->
        </el-form-item>
        <el-form-item label="报表下载权限" prop="reportDownload">
          <el-select v-model="dialogForm.reportDownload" placeholder="请选择">
            <el-option v-for="(value, key, index) in backStageData" :key="index" :label="value" :value="Number(key)">{{ value }}</el-option>
          </el-select>
          <!-- <el-radio v-model="dialogForm.reportDownload" v-for="(value, key, index) in backStageData" :key="index" :label="value" :value="Number(key)">{{ value }}</el-radio> -->
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="
            dialogStatus === 'create'
              ? createData('dialogForm')
              : updateData('dialogForm')
          ">确 定</el-button>
      </span>
    </el-dialog>
    
    <!-- 关联站点 -->
    <div class="dialog">
      <el-dialog title="关联站点" :visible.sync="dialogShow" width="30%">
        <div class="site-tree">
          <div align="left">
            <el-checkbox v-model="isCheckAll" @change="handleTree"/> 全选/反选
          </div>
          <el-tree ref="tree" node-key="id" empty-text="无站点列表数据" :props="props" :data="projectInfoData" show-checkbox :default-checked-keys="treeChecked" @check="checkType">
            <span class="custom-tree-node" slot-scope="{ node }">
              <span class="show-bar">{{ node.label }}</span>
            </span>
          </el-tree>
        </div>
        <div class="save-tree">
          <el-button type="primary" size="mini" @click="handleSaveClick">保存</el-button>
        </div>
      </el-dialog>
    </div>

  </div>
</template>
<script>
  import {
    getUsers,
    postUser,
    updateUser,
    getRoleAll,
    updateUserPwd,
    getUserTemp,
    getUserExport,
    postUserImport,
    removeUsers
  } from '@/api/back'
  import { getUserSite, postUserSite } from '@/api/user'
  import { getSiteInfo } from '@/api/site'

  import { getUserId } from '@/utils/auth'
  export default {
    data() {
      // 验证用户有效性
      const validaUserName = (rule, value, callback) => {
        let regExp = new RegExp('^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\\W_]+$)(?![a-z0-9]+$)(?![a-z\\W_]+$)(?![0-9\\W_]+$)[a-zA-Z0-9\\W_]{8,}$')
        if (!regExp.test(value)) {
          callback(new Error('大、小写字母、数字和特殊字符(8位以上)'))
        } else {
          callback()
        }
      }
      const validaTime = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请选择到期时间'))
        } else {
          const now = +new Date()
          const time = +new Date(value)
          if (now > time) {
            callback(new Error('到期时间不能小于当前时间'))
          } else {
            callback()
          }
        }
      }
      const validEmail = (rule, value, callback) => {
        let regExp = new RegExp('^([a-z0-9A-Z]+[-|.]?)+[a-z0-9A-Z]@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-zA-Z]{2,}$')
        if (!regExp.test(value)) {
          callback(new Error('请输入正确邮箱格式'))
        } else {
          callback()
        }
      }
      return {
        isCheckAll: false,
        // 性别枚举
        sexEnum: {
          0: '男',
          1: '女'
        },
        backStageData: {
          0: '是',
          1: '否'
        },
        reportDownloadData: {
          0: '是',
          1: '否'
        },
        props: {
          label: 'pressureSiteName'
        },
        userId: "",
        // 状态枚举
        statusEnum: {
          0: { label: '注销', color: '#F56C6C' },
          1: { label: '激活', color: '#67C23A' },
          2: { label: '休眠', color: '#E6A23C' }
        },
        // 账户类型枚举
        accountTypeEnum: {
          0: '长期',
          1: '临时'
        },
        offices: [], // 职位列表
        tableData: [],
        treeChecked: [],
        tableTotal: 0,
        form: {
          page: 1,
          rows: 10,
          roleName: null,
          username: null,
          userId: null,
        },
        dialogStatus: 'create',
        dialogMap: {
          create: '新增',
          update: '编辑'
        },

        dialogVisible: false,
        dialogShow: false,
        projectValue: [],
        projectInfoData: [],
        projectForm: {
          userId: '',
          siteIds: []
        },
        dialogForm: {
          id: null,
          name: null, // 姓名
          username: null, // 账号名称
          accountType: null, // 账户类型
          position: null,
          email: null, // 邮箱
          roleId: null, // 角色ID
          sex: null, // 性别
          status: null, // 状态
          telephone: null, // 手机号码
          expirationTime: null, // 到期时间，临时账户必填,
          // actualPassword: null,
          backStage: null,
          reportDownload: null,
        },
        dialogRules: {
          name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
          username: [
            { required: true, message: '请输入账号名称', trigger: 'blur' },
          ],
          // actualPassword: [
          //   { required: true, message: '请输入密码', trigger: 'blur' },
          // ],
          roleId: [{ required: true, message: '请选择角色', trigger: 'change' }],
          backStage: [{ required: true, message: '请选择后台管理表权限', trigger: 'change' }],
          reportDownload: [{ required: true, message: '请选择报表下载权限', trigger: 'change' }],
          sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
          status: [{ required: true, message: '请选择状态', trigger: 'change' }],

          accountType: [
            { required: true, message: '请选择账户类型', trigger: 'change' }
          ],
          expirationTime: [{ required: true, validator: validaTime, trigger: 'change' }],
          email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            {
              validator: validEmail,
              trigger: ['blur', 'change']
            }
          ]
        },
        roleOption: []
      }
    },
    created() {
      this.form.userId = getUserId()
      //
      // if (!this.$isBtnAuth('user:list')) {
      //   this.$message({
      //     type: 'info',
      //     message: '无权限查看'
      //   });
      //   return;
      // }
      this.getUsersHandle()
      this.fetchRoleAll()
      // this.getUserOfficeHandle()
    },
    methods: {
      handleAccount(val) {
        console.log(val)
      },
      handleTree() { // el-tree全选事件
        if (this.isCheckAll) { // 全选
          this.$refs.tree.setCheckedNodes(this.projectInfoData)
        } else { // 取消选中
          this.$refs.tree.setCheckedKeys([])
        }
      },
      checkType(val) {
        console.log('213', val);
      },
      handleDelete(row) {
        this.$confirm('此操作将永久该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.removeUser(row.id)
        })
      },
      handleDelete(row) {
        this.$confirm('此操作将永久该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.removeUser(row.id)
        })
      },
      removeUser(id) {
        removeUsers(id).then(res => {
          this.$message.success('删除成功')
          this.getUsersHandle()

        })
      },
      handleSaveClick() {
        this.projectForm.siteIds = this.$refs.tree.getCheckedKeys()
        postUserSite(this.projectForm).then(res => {
          this.$message.success('关联成功')
          this.dialogShow = false
        })
      },
      handleRelevance(row) {
        this.projectForm.userId = row.id
        let params = {
          page: 1,
          rows: 500
        }
        getSiteInfo(params).then(async res => {
          this.projectInfoData = res.rows
          await this.getUserProjectData(row.id)
          this.dialogShow = true
        })
      },
      getUserProjectData(id) {
        getUserSite({ userId: id }).then(res => {
          this.$refs.tree.setCheckedNodes([])
          this.treeChecked = res.rows.map(item => item.pressureSiteId)
        })
      },
      handleProject(val) {
        console.log('23', val);
        this.projectForm.siteIds = val
      },
      handlAffirm() {

      },
      resetForm() {
        this.form = {
          page: 1,
          rows: 10,
          username: null,
          roleName: null
        }
      },

      resetTemp() {
        this.dialogForm = {
          id: null,
          name: null, // 姓名
          username: null, // 账号名称
          accountType: null, // 账户类型
          email: null, // 邮箱
          roleId: null, // 角色ID
          sex: null, // 性别
          status: null, // 状态
          telephone: null, // 手机号码
          expirationTime: null // 到期时间，临时账户必填
        }
      },
      handleReset() {
        this.resetForm()
        this.getUsersHandle()
      },
      handleSearch() {
        this.getUsersHandle()
      },
      handleNew() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogVisible = true
        this.$nextTick(() => {
          this.$refs['dialogForm'].clearValidate()
        })
      },
      handleTemp() {
        this.fetchUserTemp()
      },
      handleExport() {
        this.fetchUserExport()
      },
      // handleImport() {
      //   this.createUserImport()
      // },
      handleFile(file) {
        const excel = file.target.files[0]
        if (excel) {
          this.createUserImport(excel)
        }
      },
      handleEdit(row) {
        this.resetTemp()
        this.dialogStatus = 'update'
        // for (let k in this.dialogForm) {
        //   this.dialogForm[k] = row[k]
        // }
        this.dialogForm = Object.assign({}, row)
        this.dialogVisible = true
        this.$nextTick(() => {
          this.$refs['dialogForm'].clearValidate()
        })
      },
      handleResetPwd(row) {
        this.$confirm('此操作将重置密码, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.updateUserPwdHandle(row.id)
        })
      },
      handleCurrentChange(val) {
        this.form.page = val
        this.getUsersHandle()
      },
      handleSizeChange(val) {
        this.form.rows = val
        this.form.page = 1
        this.getUsersHandle()
      },
      createData(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.dialogForm.telephone) {
              let regExp = /0?(13|14|15|16|17|18|19)[0-9]{9}/
              if (!regExp.test(this.dialogForm.telephone)) {
                this.$message.error('手机号码格式不正确')
                return
              }
            }
            this.postUserHandle()
          }
        })
      },
      updateData(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.updateUserHandle()
          }
        })
      },
      getUsersHandle() {
        getUsers(this.form).then((data) => {
          const { total, rows } = data
          this.tableData = rows || []
          this.tableTotal = total || 0
        })
      },
      postUserHandle() {
        console.log(this.dialogForm)
        postUser(this.dialogForm).then(() => {
          this.dialogVisible = false
          this.getUsersHandle()
          this.$message.success('新增成功')
        })
      },
      updateUserHandle() {
        console.log(this.dialogForm)
        updateUser(this.dialogForm).then(() => {
          this.dialogVisible = false
          this.getUsersHandle()
          this.$message.success('更新成功')
        })
      },
      fetchRoleAll() {
        getRoleAll().then((data) => {
          this.roleOption = data || []
        })
      },
      updateUserPwdHandle(id) {
        updateUserPwd({ id: id }).then(() => {
          this.getUsersHandle()
          this.$message.success('重置成功')
        })
      },
      fetchUserTemp() {
        getUserTemp().then((data) => {
          const link = document.createElement('a')
          link.href = data
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        })
      },
      fetchUserExport() {
        getUserExport(this.form).then((data) => {
          const link = document.createElement('a')
          link.href = data
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        })
      },
      createUserImport(file) {
        const formData = new FormData()
        formData.append('file', file)
        postUserImport(formData).then(() => {
          this.$refs.file.value = ''
          this.getUsersHandle()
          this.$message.success('导入成功')
        }).catch(() => {
          this.$refs.file.value = ''
        })
      },
      // getUserOfficeHandle() {
      //   getUserOffice().then((data) => {
      //     this.offices = data || []
      //   })
      // }
    }
  }
</script>
<style lang="scss">
  .site-tree {
    // height: 570px;
    overflow-y: auto;
    // margin-left: 50px;
    border: 1px solid #ebeef5;
  }

  .save-tree {
    width: 100%;
    padding: 10px;
    text-align: center;
    // margin-left: 50px;
    border: 1px solid #ebeef5;
    border-top: 0;
  }
</style>