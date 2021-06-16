<!--
 * @Author: showier
 * @Date: 2021-04-14 09:14:26
 * @LastEditTime: 2021-04-20 14:04:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \admin-template\src\views\system\app.vue
-->
<template>
  <div>
    <el-row :gutter="30">
      <el-col :span="10">
        <el-button type="primary" @click="handleAdd" :disabled="!$isBtnAuth('projectInfo:add')">新增</el-button>
      </el-col>
    </el-row>

    <!-- 列表 -->
    <el-table :data="tableData">
      <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
      <el-table-column label="信息" prop="appImage"></el-table-column>
      <el-table-column label="图片" prop="appImagePath">
        <template slot-scope="scope">
          <img :src="scope.row.appImagePath" width="70" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" plain @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" plain @click="handleDele(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 模态框 -->
    <el-dialog :title="dialogMap[dialogStatus]" :visible.sync="dialogVisible" :show-close="false" style="width:800px;margin:0 auto;">
      <el-form ref="dialogForm" :model="dialogForm" :inline="true" label-width="100px" :rules="dialogRules">
        <el-form-item label="图片" prop="multipartFile">
          <div class="file-box">
            <input type="file" ref="upload" @change="changePicture" class="file-change" accept="image/png, image/jpeg" />
            <img v-if="dialogForm.appImagePath" :src="dialogForm.appImagePath" class="avatar">
            <i v-else class="el-icon-plus"></i>
            <div class="file-tip">只能上传jpg/png文件，且不超过2MB(600×450)</div>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogStatus === 'create' ? createData() : updateData()">确 定</el-button>
      </span>
    </el-dialog>


    <div v-if="cropperVisible" class="images-cropper">
      <div class="cropper-mask"></div>
      <vueCropper ref="cropper" :img="cropperOption.img" :outputSize="cropperOption.size" fixed-box auto-crop center-box :outputType="cropperOption.outputType" :auto-crop-width="cropperOption.autoCropWidth" :auto-crop-height="cropperOption.autoCropHeight"></vueCropper>
      <div class="cropper-form">
        <el-button type="primary" @click="handleCropper">确认</el-button>
      </div>
    </div>
  </div>
</template>
<script>
  import { getAppImg, postAppImg, putAppImg, deleAppImg } from '@/api/system'
  import { VueCropper } from 'vue-cropper'
  import EXIF from 'exif-js'
  export default {
    components: {
      VueCropper
    },
    data() {
      return {
        siteList: [],
        disabled: false,
        cropperVisible: false,
        cropperOption: {
          img: '',
          size: 1,
          full: false,
          outputType: 'png',
          canMove: true,
          fixedBox: false,
          original: false,
          canMoveBox: true,
          autoCrop: true,
          // 只有自动截图开启 宽度高度才生效
          autoCropWidth: 600,
          autoCropHeight: 450,
          centerBox: false,
          high: true,
          max: 99999
        },
        tableData: [],
        dialogVisible: false,
        dialogStatus: 'create',
        dialogMap: {
          update: '编辑',
          create: '新增'
        },
        dialogForm: {
          multipartFile: null,
          appImagePath: null
        },
        dialogRules: {

        },
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      handleCropper() {
        this.$refs.cropper.getCropData((data) => {
          this.dialogForm.appImagePath = data
          this.dialogForm.multipartFile = this.base64ToFileObject(data)
          this.cropperVisible = false
        })
      },
      handleAdd() {
        this.$nextTick(() => {
          this.$refs['dialogForm'].resetFields()
        })
        this.dialogForm.appImagePath = null
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
          deleAppImg(row.id).then((data) => {
            this.fetchData()
            this.$message.success('删除成功')
          })
        })
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg'
        const isPNG = file.type === 'image/png'
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isJPG && !isPNG) {
          this.$message.error('上传图片只能是 JPG 和 PNG 格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!')
        }
        return (isJPG || isPNG) && isLt2M
      },
      changePicture(file) {
        if (this.beforeAvatarUpload(file.target.files[0])) {
          this.imgPreview(file.target.files[0])
          this.$refs.upload.value = ''
        }
      },
      imgPreview(file) {
        const that = this
        let Orientation
        // 这里的Exif是判断图片旋转的
        EXIF.getData(file, function () {
          Orientation = EXIF.getAllTags(file, 'Orientation')
        })
        if (!file || !window.FileReader) return
        if (/^image/.test(file.type)) {
          const reader = new FileReader()
          reader.readAsDataURL(file)
          reader.onloadend = function () {
            const result = this.result
            const img = new Image()
            img.src = result
            img.onload = () => {
              const data = that.compress(img, Orientation)
              // that.dialogForm.appImagePath = data
              // that.dialogForm.multipartFile = that.base64ToFileObject(data)
              that.cropperOption.img = data
              that.cropperVisible = true
            }
          }
        }
      },
      compress(img, Orientation) {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const width = img.width
        const height = img.height
        canvas.width = width
        canvas.height = height
        ctx.fillStyle = '#fff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0, width, height)
        // 处理ios手机旋转角度问题
        if (navigator.userAgent.match(/iphone/i)) {
          if (Orientation !== '' && Orientation !== 1) {
            switch (Orientation) {
            case 6:
              this.rotateImg(img, 'left', canvas)
              break
            case 8:
              this.rotateImg(img, 'right', canvas)
              break
            case 3:
              this.rotateImg(img, 'right', canvas) // 转两次
              this.rotateImg(img, 'right', canvas)
              break
            }
          }
        } else {
          // 处理其安卓类手机图片旋转的问题
          if (Orientation !== '' && Orientation !== 1) {
            switch (Orientation) {
            case 6:
              this.rotateImg(img, 'left', canvas)
              break
            case 8:
              this.rotateImg(img, 'right', canvas)
              break
            case 3:
              this.rotateImg(img, 'right', canvas)
              this.rotateImg(img, 'right', canvas)
              break
            }
          }
        }
        // ndata 为base64格式的图片上传时可直接使用，根据清晰度的要求进行调整，这里我用的是0.4
        var ndata = canvas.toDataURL('image/jpeg', 1)
        return ndata
      },
      rotateImg(img, direction, canvas) {
        // 最小与最大旋转方向，图片旋转4次后回到原方向
        const min_step = 0
        const max_step = 3
        if (img == null) return
        // img的高度和宽度不能在img元素隐藏后获取，否则会出错
        // 这里因为图片像素太大进行了一个3.5倍的缩放
        const height = img.height
        const width = img.width
        let step = 2
        if (step == null) {
          step = min_step
        }
        if (direction === 'right') {
          step++
          // 旋转到原位置，即超过最大值
          step > max_step && (step = min_step)
        } else {
          step--
          step < min_step && (step = max_step)
        }
        // 旋转角度以弧度值为参数
        const degree = (step * 90 * Math.PI) / 180
        const ctx = canvas.getContext('2d')
        switch (step) {
        case 0:
          canvas.width = width
          canvas.height = height
          ctx.drawImage(img, 0, 0, width, height)
          break
        case 1:
          canvas.width = height
          canvas.height = width
          ctx.rotate(degree)
          ctx.drawImage(img, 0, -height, width, height)
          break
        case 2:
          canvas.width = width
          canvas.height = height
          ctx.rotate(degree)
          ctx.drawImage(img, -width, -height, width, height)
          break
        case 3:
          canvas.width = height
          canvas.height = width
          ctx.rotate(degree)
          ctx.drawImage(img, -width, 0, width, height)
          break
        }
      },
      base64ToFileObject(base64) {
        base64 = base64.split(',')[1]
        base64 = window.atob(base64)
        var ia = new Uint8Array(base64.length)
        for (var i = 0; i < base64.length; i++) {
          ia[i] = base64.charCodeAt(i)
        }
        var blob = new Blob([ia], { type: 'image/jpeg' })
        var newFile = new File([blob], 'abc.jpeg')
        return newFile
      },
      createData() {
        this.$refs['dialogForm'].validate((valid) => {
          if (valid) {
            if (this.dialogForm.multipartFile) {
              const formData = new FormData()
              formData.append('multipartFile', this.dialogForm.multipartFile)
              postAppImg(formData).then((data) => {
                this.dialogVisible = false
                this.fetchData()
                this.$message.success('新增成功')
              })
            } else {
              this.$message.error('请选择图片')
            }
          }
        })
      },
      updateData() {
        this.$refs['dialogForm'].validate((valid) => {
          if (valid) {
            const formData = new FormData()
            formData.append('id', this.dialogForm.id)
            formData.append('multipartFile', this.dialogForm.multipartFile || null)
            putAppImg(formData).then((data) => {
              this.dialogVisible = false
              this.fetchData()
              this.$message.success('更新成功')
            })
          }
        })
      },
      fetchData() {
        getAppImg().then((data) => {
          this.tableData = data
        })
      },
    }
  }
</script>
<style lang="scss" scoped>
  .file-box {
    position: relative;
    border: 1px dashed #c0ccda;

    .file-change {
      position: relative;
      z-index: 2;
      width: 148px;
      height: 148px;
      cursor: pointer;
      opacity: 0;
    }

    .el-icon-plus {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      font-size: 28px;
    }

    .avatar {
      width: 148px;
      height: 100%;
      position: absolute;
      left: 0;
      display: block;
      top: 0;
    }

    .file-tip {
      position: absolute;
      line-height: 1.2;
      padding-top: 5px;
    }
  }

  .images-cropper {
    position: absolute;
    top: 60px;
    height: 700px;
    width: 1300px;
    z-index: 5000;

    .cropper-mask {
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(0, 0, 0, 0.5);
    }

    .cropper-form {
      text-align: center;
      padding-top: 10px;
      position: relative;
    }
  }
</style>