/*
 * @Author: 1971167057@qq.com
 * @since: Do not edit
 * @lastTime: 2020-09-29 13:49:30
 * @LastAuthor: Do not edit
 * @FilePath: \toncentsoft-et\src\utils\request.js
 * @Description: request拦截工具
 */
import axios from 'axios'
import router from '../router'
import {
  MessageBox,
  Message
} from 'element-ui'
// import { message } from 'ant-design-vue'
import {
  getToken,
  removeToken,
  setToken,
  getMenusAuthInfo
} from '@/utils/auth'
import {
  getRefreshToken
} from '@/api/user'

import md5 from 'js-md5'
import {
  log
} from 'mathjs'


const errCode = [1000, 1002, 1005] // 1000 token违法 1001 token刷新 1002 token刷新失败 1003 修改当前账号退出 1005长时间不操作
function getQueryString(name) {
  var reg = new RegExp("[?&]" + name + "=([^&#]*)", "i");
  var res = window.location.href.match(reg);
  if (res && res.length > 1) {
    return decodeURIComponent(res[1]);
  }
  return "";
}
let projectId = getQueryString("id");
let type = getQueryString("type");
let name = getQueryString("name");
if (sessionStorage.getItem('projectId')) {
  setTimeout(() => {
    let arr = JSON.parse(sessionStorage.getItem('projectData'))
  }, 300)
} else {
  if (projectId) {
    sessionStorage.setItem('projectId', projectId)
    sessionStorage.setItem('projectName', name)
    setTimeout(() => {
      let arr = JSON.parse(sessionStorage.getItem('projectData'))
      router.push({
        path: '/' + arr[0].path
      })
    }, 300)
  }
}

if(type){
  setTimeout(() => {
    router.push({
      path: '/back/feedback' 
    })
  }, 300)
}
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000, // request timeout
  // withCredentials:true,
  // transformRequest: [(data) => {
  //   const obj = {}
  //   for(let key in data) {
  //     if (data[key] !== null) {
  //       obj[key] = data[key]
  //     }
  //   }
  //   // Do whatever you want here, for example headers.Authorization = `Bearer ${jwt}`
  //   return obj
  // }, ...axios.defaults.transformRequest]
})
service.updateToken = token => {
  service.defaults.headers['token'] = token
  setToken(token)
}
// request interceptor
service.interceptors.request.use(
  config => {
    config.headers['token'] = getToken()
    const params = {}
    if (config.params) {
      for (let key in config.params) {
        if (config.params[key] !== null && config.params[key] !== '') {
          params[key] = config.params[key] + ''
        }
      }
    }
    config.params = {
      timestamp: +new Date() + '',
      nonce: Math.random().toString(36).substr(2),
      ...params
    }
    if (config.params.encryptType) { // 是否需要加密 0 不加密， 1加密
      const data = {}
      if (config.data) {
        for (let key in config.data) {
          if (config.data[key] !== null && config.data[key] !== '') {
            data[key] = config.data[key]
          }
        }
      }
      const arr = {
        ...data,
        ...config.params,
        secret: 'h#2TEkRTd^82+u?ch*s1qy51j%fiow8!',
        uri: config.url
      }
      const sign = {}
      // 字符串排序
      Object.keys(arr).sort().forEach(function (key) {
        sign[key] = arr[key];
      })
      const m = md5(JSON.stringify(sign))
      config.params.sign = m.toUpperCase()
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 是否正在刷新的标记
let isRefreshing = false
let isAlert = null
let key = 'updatable'
// 重试队列，每一项将是一个待执行的函数形式
let retryRequests = []
// response interceptor
service.interceptors.response.use(
  response => {
    // debugger
    const res = response.data
    if (res.code === 200) {
      return res.data
    }
    if (errCode.includes(res.code)) {
      removeToken()
      router.push('/login')
      return
    }
    if (res.code === 1003) { // 同一账号多次登录
      if (!isAlert) {
        isAlert = MessageBox.alert(res.msg, '提示', {
          confirmButtonText: '确认',
          showClose: false,
          callback: action => {
            if (action === 'confirm') {
              removeToken()
              router.push('/login')
              isAlert = null
              return
            }
          }
        })
      }
    }
    // if(res.code ===400){
    //   router.push('/login')
    // }
    if (res.code === 1001) { // 刷新Token
      const config = response.config
      if (!isRefreshing) {
        isRefreshing = true
        removeToken()
        router.push('/login')
        return getRefreshToken().then(resp => {
          const token = resp
          service.updateToken(token)
          retryRequests.forEach(cb => cb(token))
          retryRequests = []
          return service(config)
        }).catch(() => {
          removeToken()
          router.push('/login')
          return;
        }).finally(() => {
          isRefreshing = false
        })
      } else {
        return new Promise(resolve => {
          retryRequests.push(token => {
            config.headers['token'] = token
            resolve(service(config))
          })
        })
      }
    }
    // message.error({ content: res.msg, key, duration: 2 })
    Message({
      showClose: true,
      message: res.msg,
      type: 'error'
    });
    return Promise.reject(res.msg)
  },
  error => {
    // message.error({ content: error, key, duration: 2 })
    Message({
      showClose: true,
      message: error,
      type: 'error'
    });
    return Promise.reject(error)
  }
)

export default service