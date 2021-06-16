<!--
 * @Author: showier
 * @since: 2020-08-28 16:13:28
 * @lastTime: 2020-09-01 16:56:24
 * @LastAuthor: Do not edit
 * @FilePath: \vue-admin-pro\src\views\user\forgot.vue
 * @Description: 修改密码
-->
<template>
  <div class="tap-forgot bg">
    <div class="forgot-container">
      <div class="title-container">
        <h3 class="title">首次登录，需修改密码</h3>
      </div>
      <el-form ref="forgotForm" :model="forgotForm" :rules="forgotRules" hide-required-asterisk class="forgot-form">
        <el-form-item label="当前密码" prop="originalPwd">
          <el-input v-model="forgotForm.originalPwd" type="password" maxlength="16" placeholder="请输入当前密码"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPwd">
          <el-input v-model="forgotForm.newPwd" type="password" maxlength="16" placeholder="请输入新密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPwd">
          <el-input v-model="forgotForm.confirmPwd" type="password" maxlength="16" placeholder="请输入确认密码"></el-input>
        </el-form-item>
        <div class="forgot-submit">
          <el-button type="primary" @click="handleForgot('forgotForm')" class="submit">确认</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
import { updateUserPwd } from '@/api/user'
import { removeToken } from '@/utils/auth'
export default {
  data() {
    const regExp = new RegExp('^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\\W_]+$)(?![a-z0-9]+$)(?![a-z\\W_]+$)(?![0-9\\W_]+$)[a-zA-Z0-9\\W_]{8,}$')
    const validaOrigin = (rule, value, callback) => {
      if (!regExp.test(value)) {
        callback(new Error('大、小写字母、数字和特殊字符(8位以上)'))
      } else {
        callback()
      }
    }
    const validaNew = (rule, value, callback) => {
      if (!regExp.test(value)) {
        callback(new Error('大、小写字母、数字和特殊字符(8位以上)'))
      } else if (value === this.forgotForm.originalPwd) {
        callback(new Error('新密码与旧密码不能一样'))
      } else {
        callback()
      }
    }
    const validaConfirm = (rule, value, callback) => {
      if (value !== this.forgotForm.newPwd) {
        callback(new Error('两次密码不一致'))
      } else {
        callback()
      }
    }
    return {
      forgotForm: {
        confirmPwd: null, // 确认密码
        newPwd: null, // 新密码
        originalPwd: null // 原始密码
      },
      forgotRules: {
        confirmPwd: [{ required: true, message: '请输入确认密码', trigger: 'blur' }, ],
        newPwd: [{ required: true, message: '请输入新密码', trigger: 'blur' }, ],
        originalPwd: [{ required: true, message: '请输入当前密码', trigger: 'blur' }, ],
      }
    }
  },
  methods: {
    handleForgot(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.updateUserPwdHandle()
        }
      })
    },
    updateUserPwdHandle() {
      updateUserPwd(this.forgotForm).then(() => {
        this.$message.success('修改成功')
        removeToken()
        setTimeout(() => {
          this.$router.push('/site/list')
        }, 2000);
      })
    }
  }
}
</script>
<style lang="scss">
.tap-forgot{
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: auto;
    background: #f0f2f5;
    &.bg{
      // background-image: url('../../assets/logbg.jpg');
      background-repeat: no-repeat;
      background-size: cover;
    }
  .forgot-container{
    width: 368px;
    margin: 0 auto;
    padding-top: 160px;
  }
  .title-container{
    .title{
      text-align: center;
      color: #fff;
    }
  }
  .forgot-submit{
    text-align: center;
    .submit{
      width: 100%;
    }
  }
}
</style>