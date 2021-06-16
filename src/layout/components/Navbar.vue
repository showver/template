<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <template v-if="device!=='mobile'">
      </template>
      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img src="@/assets/avatar.jpg" class="user-avatar">

          <i class="el-icon-caret-bottom" />
        </div> 
        <el-dropdown-menu slot="dropdown">
           <!-- <el-dropdown-item divided>
            <span style="display:block;" @click="goHomePage">主页</span>
          </el-dropdown-item> -->
          <el-dropdown-item divided>
            <span style="display:block;" @click="handleModifyPass">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog title="编辑" :visible="modifyVisible" width="450px" :close-on-click-modal="false" append-to-body :show-close="false">
        <el-form ref="modifyForm" :model="modifyForm" :rules="modifyRules" label-width="100px">
          <el-form-item label="当前密码" prop="originalPwd">
            <el-input type="password" v-model="modifyForm.originalPwd" maxlength="16" placeholder="请输入当前密码"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newPwd">
            <el-input type="password" v-model="modifyForm.newPwd" maxlength="16" placeholder="请输入新密码"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPwd">
            <el-input type="password" v-model="modifyForm.confirmPwd" maxlength="16" placeholder="请输入确认密码"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="modifyCancel">取消</el-button>
          <el-button type="primary" @click.native="modifySubmit">确认</el-button>
        </div>
      </el-dialog>
    
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Hamburger from '@/components/Hamburger'
import Breadcrumb from '@/components/Breadcrumb'
import { removeToken } from '@/utils/auth'
import { updateUserPwd } from '@/api/user'
export default {
  components: {
    Hamburger,
    Breadcrumb
  },
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
      } else if (value === this.modifyForm.originalPwd) {
        callback(new Error('新密码与旧密码不能一样'))
      } else {
        callback()
      }
    }
    const validaConfirm = (rule, value, callback) => {
      if (value !== this.modifyForm.newPwd) {
        callback(new Error('两次密码不一致'))
      } else {
        callback()
      }
    }
    return {
      modifyVisible: false,
      modifyForm: {
        confirmPwd: null,
        newPwd: null,
        originalPwd: null
      },
      modifyRules: {
        confirmPwd: [{ required: true, message: '请输入确认密码', trigger: 'blur' }, ],
        newPwd: [{ required: true, message: '请输入新密码', trigger: 'blur' }, ],
        originalPwd: [{ required: true, message: '请输入当前密码', trigger: 'blur' },],
      }
    }
  },
  watch: {
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device',
      'userInfo'
    ])
  },
  methods: {
  
    goHomePage() {
        const { origin, pathname } = document.location
        const url = origin + pathname + '#/login'
    
      window.open(url)
    },
    modifyCancel() {
      this.modifyVisible = false
    },
    modifySubmit() {
      this.$refs.modifyForm.validate((valid) => {
        if (valid) {
          this.updateUserPwdHandle()
        } else {
          return false
        }
      })
    },
    handleModifyPass() {
      this.modifyVisible = true
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      this.$confirm('此操作将退出当前系统, 是否继续?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        removeToken()
        sessionStorage.clear()
        localStorage.clear()
        const { origin, pathname } = document.location
        const url = origin + '#/user/login'
        // const url = origin + pathname + '#/login'
        window.location.href = url
      })
    },
    updateUserPwdHandle() {
      updateUserPwd(this.modifyForm).then(() => {
        this.$message.success('修改成功')
        setTimeout(() => {
          removeToken()
          const { origin, pathname } = document.location
          const url = origin + pathname + '#/login'
          window.location.href = url
        }, 1000)
      }).catch(() => {
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #324157;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    display: flex;
  
    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #ffff;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
  .name-box {
    color: #9eadc2;
  }
}
</style>
