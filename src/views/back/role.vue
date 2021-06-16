<!--
 * @Author: showier
 * @since: 2020-08-26 14:31:54
 * @lastTime: 2020-09-01 17:41:51
 * @LastAuthor: Do not edit
 * @FilePath: \vue-admin-pro\src\views\back\role.vue
 * @Description: 后台-角色
-->
<template>
  <div class="back-role">
    <div class="form">
      <el-form inline>
        <el-form-item>
          <el-input v-model="form.name" maxlength="20" show-word-limit placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button type="primary" @click="handleReset">重置</el-button>
          <el-button :disabled="!$isBtnAuth('role:add')" type="primary" @click="handleNew">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-row :gutter="20">
      <el-col :span="14">
        <div class="table">
          <el-table border :data="tableData" @row-click="handleRow">
            <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
            <el-table-column label="角色名称" prop="name" sortable></el-table-column>
            <el-table-column label="备注" prop="memo" sortable></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="{ row }">
                <el-button :disabled="!$isBtnAuth('role:edit')" size="mini" type="primary" plain @click="handleEdit(row)">编辑</el-button>
                <el-button :disabled="!$isBtnAuth('role:del')" size="mini" type="danger" plain @click="handleDelete(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="page">
          <el-pagination :total="tableTotal" :current-page="form.page" :page-size="form.rows" @current-change="handleCurrentChange" @size-change="handleSizeChange" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
        </div>
      </el-col>
      <el-col :span="10">
        <div class="pageBox">
          <div class="name">后台页面权限</div>
          <div class="name">前端页面权限</div>
        </div>
        <div style="display:flex">
          <div class="tree" style="width:100%">
            <el-tree ref="tree" show-checkbox default-expand-all :default-checked-keys="currentMenu" node-key="id" :props="treeProps" :data="treeOption"></el-tree>
            <div class="tree-btn" v-if="$isBtnAuth('roleResource:add')">
              <!-- <el-button type="primary" @click="handleRoleMenu">提交</el-button> -->
            </div>
          </div>
          <div class="tree" style="width:50%">
            <el-tree ref="treeWeb" show-checkbox default-expand-all :default-checked-keys="currentWebMenu" node-key="id" :props="treeProps" :data="treeWebOption"></el-tree>
            <div class="tree-btn" v-if="$isBtnAuth('roleResource:add')">
              <!-- <el-button type="primary" @click="handleRoleMenu">提交</el-button> -->
            </div>
          </div>
        </div>
        <div class="tree-btn">
          <el-button type="primary" @click="handleRoleMenu">提交</el-button>
        </div>
      </el-col>
    </el-row>
    
    <!-- 模态框 -->
    <el-dialog :title="dialogMap[dialogStatus]" :visible.sync="dialogVisible" :show-close="false" style="width:800px;margin:0 auto;">
      <el-form ref="dialogForm" :model="dialogForm" :rules="dialogRules" label-width="100px" :inline="true">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="dialogForm.name" maxlength="20" show-word-limit placeholder="请输入角色标识"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="memo">
          <el-input type="textarea" v-model="dialogForm.memo" maxlength="50" :rows="5" show-word-limit placeholder="请输入备注"></el-input>
        </el-form-item>
        <el-form-item label="角色标识" prop="identity">
          <el-select v-model="dialogForm.identity" placeholder="请选择角色标识">
            <el-option v-for="(item, index) in markOption" :key="index" :value="item.kind" :label="item.itemValue">{{ item.itemValue }}</el-option>
          </el-select>
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
  </div>
</template>
<script>
  import { getRoles, getRoleMark, postRole, updateRole, removeRole, getMenus, getRoleMenu, postRoleMenu, getWebMenus, getRoleWebMenu } from '@/api/back'
  import { getMenusAuthInfo } from '@/utils/auth'
  export default {
    data() {
      return {
        tableData: [],
        tableTotal: 0,
        form: {
          page: 1,
          rows: 10,
          name: null
        },
        dialogStatus: 'create',
        dialogMap: {
          create: '新增',
          update: '编辑'
        },
        dialogVisible: false,
        dialogForm: {
          id: null,
          name: null, // 角色名称
          memo: null, // 备注
          identity: null
        },
        dialogRules: {
          name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
          identity: [{ required: true, message: '请选择角色标识', trigger: 'change' }]
        },
        markOption: [], // 角色标识列表
        treeOption: [],
        treeWebOption: [],
        currentWebMenu: [],
        treeProps: {
          label: 'name',
          children: 'children'
        },
        isActiveUser: false,
        userInfo: JSON.parse(sessionStorage.getItem('userInfo')),
        currentMenu: [], // 当前用户菜单

        roleMenuForm: {
          resourcesIds: [],
          roleId: null
        }
      }
    },
    created() {
      if (!this.$isBtnAuth('role:list')) {
        this.$message({
          type: 'info',
          message: '无权限查看'
        });
        return;
      }
      this.fetchRoles()
      this.fetchRoleMark()
      this.fetchMenus()
      this.fetchWebMenus()
    },
    methods: {
      resetForm() {
        this.form = {
          page: 1,
          rows: 10,
          name: null
        }
      },
      resetTemp() {
        this.dialogForm = {
          id: null,
          name: null, // 角色名称
          memo: null, // 备注
          identity: null
        }
      },
      handleReset() {
        this.resetForm()
        this.fetchRoles()
      },
      handleSearch() {
        this.fetchRoles()
      },
      handleNew() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogVisible = true
        this.$nextTick(() => {
          this.$refs['dialogForm'].clearValidate()
        })
      },
      handleRow(row) {
        this.roleMenuForm.roleId = row.id
        // this.isActiveUser = this.userInfo.roleIdentity === row.identity
        this.fetchRoleWebMenu()
        this.fetchRoleMenu()

      },
      handleEdit(row) {
        this.resetTemp()
        this.dialogStatus = 'update'
        for (let k in this.dialogForm) {
          this.dialogForm[k] = row[k]
        }
        this.dialogVisible = true
        this.$nextTick(() => {
          this.$refs['dialogForm'].clearValidate()
        })
      },
      handleDelete(row) {
        this.$confirm('此操作将永久该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.removeRole(row.id)
        })
      },
      handleCurrentChange(val) {
        this.form.page = val
        this.fetchRoles()
      },
      handleSizeChange(val) {
        this.form.rows = val
        this.form.page = 1
        this.fetchRoles()
      },
      createData(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.postRole()
          }
        })
      },
      updateData(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.updateRole()
          }
        })
      },
      handleRoleMenu() {
        // debugger
        if (!this.roleMenuForm.roleId) {
          this.$message.error('请先选择角色')
          return
        }
        const arr = this.$refs.tree.getHalfCheckedKeys() // 半选中状态
        this.roleMenuForm.resourcesIds = this.$refs.tree.getCheckedNodes().map(x => {
          return x.id
        })
        // const arrWeb = this.$refs.treeWeb.getHalfCheckedKeys() // 半选中状态
        // const webMenu = this.$refs.treeWeb.getCheckedNodes().map(x => {
        //   return x.id
        // })
        // this.roleMenuForm.resourcesIds = [...arr, ...arrWeb, ...this.roleMenuForm.resourcesIds, ...webMenu]
        this.roleMenuForm.resourcesIds = [...arr, ...this.roleMenuForm.resourcesIds]
        this.$confirm('此操作将保存菜单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.postRoleMenu()
        })
      },
      modifyMenu(menus) {
        menus.map(menu => {
          if (menu.checked) {
            this.currentMenu.push(menu.id)
          }
          if (menu.children && menu.children.length) {
            this.modifyMenu(menu.children)
          }
        })
      },
      modifyWebMenu(menus) {

        menus.map(menu => {
          if (menu.checked) {
            this.currentWebMenu.push(menu.id)
          }
          if (menu.children && menu.children.length) {
            this.modifyWebMenu(menu.children)
          }
        })
      },

      fetchRoles() {
        getRoles(this.form).then((data) => {
          const { total, rows } = data
          this.tableData = rows || []
          this.tableTotal = total || 0
        })
      },
      fetchRoleMark() {
        getRoleMark().then(data => {
          this.markOption = data || []
        })
      },
      postRole() {
        postRole(this.dialogForm).then(() => {
          this.dialogVisible = false
          this.fetchRoles()
          this.$message.success('新增成功')
        })
      },
      updateRole() {
        updateRole(this.dialogForm).then(() => {
          this.dialogVisible = false
          this.fetchRoles()
          this.$message.success('更新成功')
        })
      },
      removeRole(id) {
        removeRole(id).then(() => {
          this.fetchRoles()
          this.$message.success('删除成功')
        })
      },
      fetchMenus() {
        getMenus().then(data => {
          this.treeOption = data || []
        })
      },
      fetchWebMenus() {
        getWebMenus().then(data => {
          this.treeWebOption = data || []
        })
      },
      fetchRoleMenu() {
        getRoleMenu(this.roleMenuForm.roleId).then(data => {
          this.currentMenu = []
          this.$refs.tree.setCheckedKeys([])
          this.modifyMenu(data || [])
        })
      },
      fetchRoleWebMenu() {
        getRoleWebMenu(this.roleMenuForm.roleId).then(data => {
          this.currentWebMenu = []
          this.$refs.treeWeb.setCheckedKeys([])
          this.modifyWebMenu(data || [])
        })
      },

      postRoleMenu() {
        postRoleMenu(this.roleMenuForm).then(() => {
          this.$message.success('保存成功')
          // 修改当前自己角色的权限，重新获取权限
          if (this.isActiveUser) {
            getMenusAuthInfo()
          }

        })
      }
    }
  }
</script>
<style lang="scss">
  .tree-btn {
    display: flex;
    height: 60px;
    border: 1px solid #ebeef5;
    justify-content: center;
    align-items: center;
  }

  .pageBox {
    display: flex;
    border: 1px solid #ebeef5;
    width: 100%;
    height: 40px;

    .name {
      width: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
</style>