<!--
 * @Author: showier
 * @since: 2020-09-01 13:46:54
 * @lastTime: 2020-09-03 10:18:51
 * @LastAuthor: Do not edit
 * @FilePath: \vue-admin-pro\src\views\system\apk.vue
 * @Description: APK管理
-->
<template>
  <div class="tap-apk">
    <div class="form">
      <el-form inline>
        <el-form-item>
          <el-input v-model="form.versionName" maxlength="20" show-word-limit placeholder="请输入版本名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="form.versionCode" maxlength="10" show-word-limit placeholder="请输入版本号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button type="primary" @click="handleReset">重置</el-button>
          <el-button type="primary" @click="handleNew">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    
    <!-- 列表 -->
    <el-table :data="tableData">
      <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
      <el-table-column label="创建人" align="center" prop="creater" sortable></el-table-column>
      <el-table-column label="创建时间" align="center" width="200" prop="createTime" sortable></el-table-column>
      <el-table-column label="更新人" align="center" prop="updater"></el-table-column>
      <el-table-column label="更新时间" align="center" width="200" prop="updateTime"></el-table-column>
      <el-table-column label="版本名称" align="center" prop="versionName"></el-table-column>
      <el-table-column label="版本号" align="center" prop="versionCode" sortable></el-table-column>
      <el-table-column label="状态" align="center" prop="status" sortable>
        <template slot-scope="{row}">
          <span :style="{color:statusEnum[row.status].color}">{{ statusEnum[row.status].label }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="memo"></el-table-column>
      <el-table-column width="250" label="操作">
        <template slot-scope="{row}">
          <el-button type="primary" plain :disabled="row.status===1" @click="handleEdit(row)">编辑</el-button>
          <el-button type="info" plain @click="handleDownload(row)">下载</el-button>
          <el-button type="info" plain :disabled="row.status===1" @click="handlePublish(row)">发布</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page">
      <el-pagination :total="tableTotal" :current-page="form.page" :page-size="form.rows" @current-change="handleCurrentChange" @size-change="handleSizeChange" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
    </div>
    
    <!-- 模态框 -->
    <el-dialog :title="dialogMap[dialogStatus]" :visible.sync="dialogVisible" :show-close="false" :close-on-click-modal="false" style="width:1000px;margin:0 auto;">
      <el-form ref="dialogForm" :model="dialogForm" :rules="dialogRules" label-width="140px" :inline="true">
        <!-- <div class="file-name">{{ dialogForm.filePath }}</div> -->
        <el-form-item label="APK文件">
          <input ref="file" class="file" type="file" @change="handleFile" />
        </el-form-item>
        <el-form-item label="备注" prop="memo">
          <el-input v-model="dialogForm.memo" type="textarea" :rows="4" maxlength="200" show-word-limit placeholder="请输入备注"></el-input>
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
  import { getApk, postApk, putApk, deleApk, postApkFile, putApkVersion } from '@/api/system'
  export default {
    data() {
      return {
        tableData: [],
        tableTotal: 0,
        form: {
          page: 1,
          rows: 10,
          versionCode: null,
          versionName: null
        },
        dialogStatus: 'create',
        dialogMap: {
          create: '新增',
          update: '编辑'
        },
        dialogVisible: false,
        dialogForm: {
          id: null,
          filePath: null,
          memo: null,
          versionCode: null,
          versionName: null
        },
        dialogRules: {},
        statusEnum: {
          0: { label: '未发布', color: '#E6A23C' },
          1: { label: '已发布', color: '#67C23A' },
        }
      }
    },
    created() {
      this.getApkHandle()
    },
    methods: {
      resetTemp() {
        this.dialogForm = {
          id: null,
          filePath: null,
          memo: null,
          versionCode: null,
          versionName: null
        }
      },
      resetForm() {
        this.form = {
          page: 1,
          rows: 10,
          versionCode: null,
          versionName: null
        }
      },
      handleNew() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogVisible = true
        this.$nextTick(() => {
          this.$refs.file.value = ''
          this.$refs['dialogForm'].clearValidate()
        })
      },
      handleReset() {
        this.resetForm()
        this.getApkHandle()
      },
      handleSearch() {
        this.getApkHandle()
      },
      handleDownload(row) {
        const link = document.createElement('a')
        link.href = row.downloadUrl
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      },
      handlePublish(row) {
        this.putApkVersionHandle(row.id)
      },
      handleFile(file) {
        const apk = file.target.files[0]
        if (apk) {
          this.postApkFileHandle(apk)
        } else {
          this.dialogForm.filePath = null
        }
      },
      handleCurrentChange(val) {
        this.form.page = val
        this.getApkHandle()
      },
      handleSizeChange(val) {
        this.form.page = 1
        this.form.rows = val
        this.getApkHandle()
      },
      /**
       * @description: 表格行编辑
       * @param {type} Number index 序号
       * @param {type} Object row 表格行数据
       * @return {type} null
       */
      handleEdit(row) {
        this.resetTemp()
        this.dialogStatus = 'update'
        for (let k in this.dialogForm) {
          this.dialogForm[k] = row[k]
        }
        this.dialogVisible = true
        this.$nextTick(() => {
          this.$refs.file.value = '' // 清空file选择器
          this.$refs['dialogForm'].clearValidate()
        })
      },
      /**
       * @description: 表格行删除
       * @param {type} Number index 序号
       * @param {type} Object row 表格行数据
       * @return {type} null
       */
      handleDelete(row) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleApkHandle(row.id)
        })
      },
      createData(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.postApkHandle()
          }
        })
      },
      updateData(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.putApkHandle()
          }
        })
      },
      getApkHandle() {
        getApk(this.form)
          .then(data => {
            const { total, rows } = data
            this.tableData = rows
            this.tableTotal = total
          })
      },
      postApkHandle() {
        postApk(this.dialogForm).then(() => {
          this.dialogVisible = false
          this.getApkHandle()
          this.$message.success('新增成功')
        })
      },
      putApkHandle() {
        putApk(this.dialogForm).then(() => {
          this.dialogVisible = false
          this.getApkHandle()
          this.$message.success('更新成功')
        })
      },
      deleApkHandle(id) {
        deleApk(id).then(() => {
          this.getApkHandle()
          this.$message.success('删除成功')
        })
      },
      postApkFileHandle(file) {
        const formData = new FormData()
        formData.append('file', file)
        postApkFile(formData).then(data => {
          Object.assign(this.dialogForm, data)
        }).catch(() => {})
      },
      putApkVersionHandle(id) {
        putApkVersion(id).then(() => {
          this.getApkHandle()
          this.$message.success('发布成功')
        })
      }
    }
  }
</script>
<style lang="scss">
  .tap-apk {
    .file {
      display: inline-block;
      width: 185px;
    }
  }
</style>