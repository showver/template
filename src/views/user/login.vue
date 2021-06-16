<!--
 * @Author: showier
 * @since: 2020-08-25 15:52:35
 * @lastTime: 2020-09-02 10:33:12
 * @LastAuthor: Do not edit
 * @FilePath: \vue-admin-pro\src\views\user\login.vue
 * @Description: Login登录页
-->
<template>
  <div class="tap-login bg">
    <div class="login-container">
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" hide-required-asterisk class="login-form">
        <div class="title-container">
          <h3 class="title">后台模板</h3>
        </div>
        <el-form-item label="" prop="username">
          <el-input v-model="loginForm.username" name="username" placeholder="请输入用户名">
            <i slot="prefix" class="img-box-user"></i>
          </el-input>
        </el-form-item>
        <el-form-item label="" prop="password">
          <el-input v-model="loginForm.password" name="password" type="password" placeholder="请输入密码">
            <i slot="prefix" class="img-box-password"></i>
          </el-input>
        </el-form-item>
        <div class="login-submit">
          <el-button class="submit" type="primary" :loading="loading" @click="handleLogin('loginForm')">登录</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
  import { getLogin } from '@/api/user'
  import { setToken, getMenusAuthInfo } from '@/utils/auth'
  import { isEmpty } from '@/utils/serve';
  export default {
    data() {
      return {
        loading: false,
        loginForm: {
          username: '',
          password: ''
        },
        loginRules: {
          username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
          password: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
        }
      }
    },
    methods: {
      handleLogin(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.getLoginHandle()
          }
        })
      },
      getLoginHandle() {
        getLogin(this.loginForm).then(data => {
          this.loading = false
          const { token, needChangePaw } = data
          sessionStorage.setItem('userInfo', JSON.stringify(data));
          setToken(token)
          getMenusAuthInfo().then((value) => {
            if (needChangePaw) { // 是否第一次登录
              this.$router.push('/site/list')
              // this.$router.push('/forgot')
            } else {
              this.$router.push('/site/list')
            }
          })
        }).catch(() => {
          this.loading = false
        })
      }
    }
  }
</script>
<style lang="scss">
  .tap-login {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: auto;
    background: #f0f2f5;

    &.bg {
      width: 100%;
      height: 100%;
      // background-image: url("../../assets/bg.jpg");
      background-repeat: no-repeat;
      background-size: 100%;
    }

    .login-container {
      width: 20%;
      // margin: 0 auto;
      // padding-top: 160px;
      position: fixed;
      right: 22%;
      top: 26%;

      .el-input__inner {
        background: transparent;
        border: none;
        border-bottom: 2px solid #edf0f2;
      }
    }

    @media screen and (max-width: 1366px) {
      .login-container {
        right: 22%;
        top: 20%;
      }
    }

    .title-container {
      .title {
        text-align: center;
        color: #3f577a;
        font-size: 26px;
        margin-bottom: 50px;
      }
    }

    .login-submit {
      text-align: center;
      margin-top: 50px;

      .submit {
        width: 100%;
        background: #18497d;
        border-radius: 50px;
      }
    }
  }

  .img-box-user,
  .img-box-password {
    width: 24px;
    height: 40px;
    // background-size: 100%;
    margin-top: 8px;
    display: block;
  }

  .img-box-user {
    background: url("../../assets/icon_account@2x.png") no-repeat;
    background-size: 100%;
  }

  .img-box-password {
    background: url("../../assets/icon_password@2x.png") no-repeat;
    background-size: 100%;
  }
</style>