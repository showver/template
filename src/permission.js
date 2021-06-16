/*
 * @Author: showier
 * @since: 2020-08-25 15:15:42
 * @lastTime: 2020-09-01 15:47:17
 * @LastAuthor: Do not edit
 * @FilePath: \vue-admin-pro\src\permission.js
 * @Description: 路由权限拦截
 */
import router from './router'
import store from './store'
import { getToken, getMenusAuthInfo } from '@/utils/auth'
import { isEmpty } from '@/utils/serve';
const whiteList = ['/login']

router.beforeEach(async (to, form, next) => {
  const hasToken = getToken()
  if (hasToken) {
    if (to.matched.length === 0) {
      next('/404')
    }
    if (isEmpty(sessionStorage.getItem('menuAuths'))) {
      getMenusAuthInfo().then(() => {
        next()
      })
    } else {
      next()
    }
  } else {

    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next({
        path: '/login'
      })
    }
  }
})

router.afterEach(() => {})