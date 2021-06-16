<!--
 * @Author: showier
 * @since: 2020-08-26 14:35:29
 * @lastTime: 2020-09-03 14:14:35
 * @LastAuthor: Do not edit
 * @FilePath: \vue-admin-pro\src\views\back\power.vue
 * @Description: 后台-权限
-->
<template>
  <div class="back-power">
    <div class="form">
      <el-form inline>
        <el-form-item>
          <el-button :disabled="!$isBtnAuth('resource:add')" type="primary" @click="handleNew">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <div class="role-box">后台权限管理</div>
      <el-table border :data="tableData" row-key="id">
        <el-table-column label="菜单名称" prop="name"></el-table-column>
        <el-table-column label="菜单类型" prop="name">
          <template slot-scope="{row}">
            <span>{{ menuTypeEnum[row.type] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="icon" prop="icon"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="授权码" prop="code"></el-table-column>
        <el-table-column label="排序" prop="priority"></el-table-column>
        <el-table-column width="250" label="操作">
          <template slot-scope="{row}">
            <el-button :disabled="!$isBtnAuth('resource:edit')" size="mini" type="primary" plain @click="handleEdit(row)">编辑</el-button>
            <el-button :disabled="!$isBtnAuth('resource:del')" size="mini" type="danger" plain @click="handleDelete(row)">删除</el-button>
            <el-button :disabled="!$isBtnAuth('resource:add')" size="mini" type="info" plain @click="handleNewSub(row)">添加下级</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="table">
      <div class="role-box">前端权限管理</div>
      <el-table border :data="tableWebData" row-key="id">
        <el-table-column label="菜单名称" prop="name"></el-table-column>
        <el-table-column label="菜单类型" prop="name">
          <template slot-scope="{row}">
            <span>{{ menuTypeEnum[row.type] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="icon" prop="icon"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="授权码" prop="code"></el-table-column>
        <el-table-column label="排序" prop="priority"></el-table-column>
        <el-table-column width="250" label="操作">
          <template slot-scope="{row}">
            <el-button :disabled="!$isBtnAuth('resource:edit')" size="mini" type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button :disabled="!$isBtnAuth('resource:del')" size="mini" type="danger" @click="handleDelete(row)">删除</el-button>
            <el-button :disabled="!$isBtnAuth('resource:add')" size="mini" type="primary" @click="handleNewSub(row)">添加下级</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    
    <!-- 模态框 -->
    <el-dialog :title="dialogMap[dialogStatus]" :visible.sync="dialogVisible" :show-close="false" :close-on-click-modal="false" style="width:800px;margin:0 auto;">
      <el-form ref="dialogForm" :model="dialogForm" :rules="dialogRules" label-width="120px">
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="dialogForm.name" maxlength="30" show-word-limit placeholder="请输入菜单名称"></el-input>
        </el-form-item>
        <el-form-item label="菜单类型" prop="type">
          <el-select v-model="dialogForm.pageType" placeholder="请选择页面类型">
            <el-option v-for="(value, key, index) in pageTypeEnum" :key="index" :label="value" :value="Number(key)">{{ value }}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单类型" prop="type">
          <el-select v-model="dialogForm.type" placeholder="请选择菜单类型">
            <el-option v-for="(value, key, index) in menuTypeEnum" :key="index" :label="value" :value="Number(key)">{{ value }}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单icon" prop="icon">
          <el-input v-model="dialogForm.icon" maxlength="20" show-word-limit placeholder="请输入菜单icon"></el-input>
        </el-form-item>
        <el-form-item label="菜单路径" prop="path">
          <el-input v-model="dialogForm.path" maxlength="50" show-word-limit placeholder="请输入菜单路径"></el-input>
        </el-form-item>
        <el-form-item label="授权码" prop="code">
          <el-input v-model="dialogForm.code" maxlength="30" show-word-limit placeholder="请输入授权码"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="priority">
          <el-input v-model="dialogForm.priority" maxlength="10" show-word-limit placeholder="请输入排序值"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" style="width:100%;box-sizing:border-box;">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogStatus === 'create' ? createData('dialogForm') : updateData('dialogForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import { getMenus, postMenu, updateMenu, removeMenu, getWebMenus } from '@/api/back'
  import { isEmpty } from '@/utils/serve';
  export default {
    data() {
      let that = this;
      let validateCode = (rule, value, callback) => {
        if (!isEmpty(value)) {
          let arr = that.authArr.filter(item => { return item.code === value.trim() });
          if (!isEmpty(arr) && arr[0].id !== this.dialogForm.id) {
            callback(new Error('授权码不能重复'));
          } else {
            callback();
          }
        } else {
          callback();
        }
      };
      return {
        tableData: [],
        menuTypeEnum: {
          0: '菜单',
          1: '功能'
        },
        pageTypeEnum: {
          1: '后台页面',
          2: '前端页面'
        },
        dialogStatus: 'create',
        dialogMap: {
          create: '新增',
          update: '编辑'
        },
        dialogVisible: false,
        dialogForm: {
          id: null,
          name: null, // 菜单名称
          type: 0, // 菜单类型
          icon: null, // 菜单icon
          parentId: null, // 菜单父节点
          path: null, // 菜单路径
          code: null, // 授权码
          priority: null, // 排序,
          pageType: 1,
        },
        authArr: [],
        authWebArr: [],
        tableWebData: [],
        dialogRules: {
          name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
          path: [{ required: true, message: '请输入菜单路径', trigger: 'blur' }],
          priority: [{ required: true, message: '请输入排序值', trigger: 'blur' }],
          code: [{ validator: validateCode, trigger: 'blur' }]
        }
      }
    },
    created() {
      if (!this.$isBtnAuth('resource:list')) {
        this.$message({
          type: 'info',
          message: '无权限查看'
        });
        return;
      }
      this.fetchMenus()
      this.fetchWebMenus()
    },
    methods: {
      getAuthorization(arr, codeArr) {
        if (Array.isArray(codeArr) && codeArr.length !== 0) {
          codeArr.forEach(item => {
            if (!isEmpty(item.code)) {
              arr.push({ id: item.id, code: item.code.trim() })
            }
            if (Array.isArray(item.children) && item.children.length !== 0) {
              this.getAuthorization(arr, item.children);
            }
          })
        }
      },
      createData(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (isNaN(this.dialogForm.priority)) {
              this.$message.error('排序值格式错误')
              return
            }
            this.createMenu()
          }
        })
      },
      updateData(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (isNaN(this.dialogForm.priority)) {
              this.$message.error('排序值格式错误')
              return
            }
            this.updateMenu()
          }
        })
      },
      resetTemp() {
        this.dialogForm = {
          id: null,
          name: null, // 菜单名称
          type: 0, // 菜单类型
          icon: null, // 菜单icon
          parentId: null, // 菜单父节点
          path: null, // 菜单路径
          code: null, // 授权码
          priority: null // 排序
        }
      },
      handleNew() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogVisible = true
        this.$nextTick(() => {
          this.$refs['dialogForm'].clearValidate()
        })
      },
      handleEdit(row) {
        this.resetTemp()
        this.dialogStatus = 'update'
        for (let k in this.dialogForm) {
          this.dialogForm[k] = row[k]
        }
        this.dialogForm.pageType = row.pageType
        delete this.dialogForm.children
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
          this.removeMenu(row.id)
        })
      },
      handleNewSub(row) {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogVisible = true
        this.$nextTick(() => {
          this.$refs['dialogForm'].clearValidate()
        })
        this.dialogForm.parentId = row.id
      },
      fetchMenus() {
        getMenus().then(data => {
          this.tableData = data || []
          let arr = []
          this.getAuthorization(arr, this.tableData)
          this.authArr = arr;
        })
      },
      fetchWebMenus() {
        getWebMenus().then(data => {
          this.tableWebData = data || []
          let arr = []
          this.getAuthorization(arr, this.tableWebData)
          this.authWebArr = arr;
        })
      },
      createMenu() {
        postMenu(this.dialogForm).then(() => {
          this.dialogVisible = false
          this.fetchMenus()
          this.fetchWebMenus()
          this.$message.success('新增成功')
        })
      },
      updateMenu() {
        updateMenu(this.dialogForm).then(() => {
          this.dialogVisible = false
          this.fetchMenus()
          this.fetchWebMenus()
          this.$message.success('更新成功')
        })
      },
      removeMenu(id) {
        removeMenu(id).then(() => {
          this.fetchMenus()
          this.fetchWebMenus()
          this.$message.success('删除成功')
        })
      }
    }
  }
</script>
<style lang="scss">
  .role-box {
    height: 50px;
    display: flex;
    align-items: center;
  }
</style>