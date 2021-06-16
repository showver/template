/*
 * @Author: 1971167057@qq.com
 * @since: Do not edit
 * @lastTime: 2020-08-25 16:11:08
 * @LastAuthor: Do not edit
 * @FilePath: \vue-admin-pro\src\utils\auth.js
 * @Description: token工具函数
 */
import { getCurrMenus } from '@/api/user'
import { isEmpty } from '@/utils/serve';
import Cookies from 'js-cookie'
import { log } from 'mathjs';
const tokenKey = 'Admin-Token'


// token处理
export function getToken() {
  return Cookies.get(tokenKey)
}
export function getUserId() {
  return Cookies.get('userId')
}
export function setToken(token) {
  return Cookies.set(tokenKey, token)
}
export function removeToken() {
  return Cookies.remove(tokenKey)
}


// 获取菜单信息
export function getMenusAuthInfo() {
  return new Promise((resolve) => {
    let MenusArr = [];
    let AuthArr = [];
    getCurrMenus().then(data => {
      getMenusList(MenusArr, data);
      getAuthCodes(AuthArr, data)
      /* 将菜单列表放入SessionStorage */
      sessionStorage.setItem('menuAuths', JSON.stringify(MenusArr));
      sessionStorage.setItem('authCodes', JSON.stringify(AuthArr));
      resolve({
        menus: MenusArr,
        authCodes: AuthArr
      })
    })
  })
}

/* 是否有按钮权限 */
export function isBtnAuth(btKey) {
  let authsKey = window.sessionStorage.getItem('authCodes')
  let key = btKey.replace(/(^\s*)|(\s*$)/g, '')
  if (isEmpty(authsKey)) {
    return false
  } else if (authsKey.indexOf(key) > -1) {
    return true
  } else {
    return false
  }
}

// 处理导航菜单
let getMenusList = function (routers, data) {
  if (!isEmpty(data) && Array.isArray(data)) {
    // debugger
    data.forEach((item) => {
      if (item.type === 0) {
        let menu = {
          path: item.path,
          name: item.name,
          icon: item.icon,
          id: item.id,
          type: item.type,
          priority: item.priority
        }
        if (item.path === '/site') {
          let arr = item.children.filter(e => {
            return (e.type === 0 && e.path !== 'site/list' && e.path !== 'site/images' && e.path !== 'site/alarm')
          })
          sessionStorage.setItem('projectData', JSON.stringify(arr))
          // item.children = []
        }
        if (!isEmpty(item.children)) {
          menu.children = [];
          getMenusList(menu.children, item.children)
        }
        routers.push(menu)
      }
    })
  }
}


// 处理权限码
let getAuthCodes = function (arr, codeArr) {
  if (Array.isArray(codeArr) && codeArr.length !== 0) {
    codeArr.forEach(item => {
      if (!isEmpty(item.code)) {
        arr.push(item.code.trim())
      }
      if (Array.isArray(item.children) && item.children.length !== 0) {
        getAuthCodes(arr, item.children);
      }
    })
  }
}