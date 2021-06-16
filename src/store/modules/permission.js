/*
 * @Author: showier
 * @since: 2020-08-26 15:31:22
 * @lastTime: 2020-08-26 18:15:15
 * @LastAuthor: Do not edit
 * @FilePath: \vue-admin-pro\src\store\modules\permission.js
 * @Description: 菜单权限
 */
// import { asyncRoutes, accessedRoutes } from '@/router'

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param menus
 */
export function filterAsyncRoutes(routes, menus) {
  const res = []
  const obj = Object.assign({}, routes[0])
  res.push(obj)
  res[0].children = []
  hasPath(routes[0].children, menus)
  // res[0].children = accessedRoutes
  res[0].children.push({ path: '*', redirect: '/404', hidden: true })
  return res
}
export function hasPath(routes, menus) {
  menus.map(menu => {
    routes.map(route => { 
      if (route.path === menu.path) {
        // accessedRoutes.push(route)
      }
    })
    if (menu.children && menu.children.length) {
      hasPath(routes, menu.children)
    }
    
  })
}
const state = {
  routes: []
}
const mutations = {
  set_routes: (state, routes) => {
    state.routes = routes
  }
}
const actions = {
  generateRoutes({ commit }, menus) {
    return new Promise(resolve => {
      const array = Object.assign([], menus)
      // let arr = filterAsyncRoutes(asyncRoutes, array)
      let arr = [];
      commit('set_routes', arr)
      resolve(arr)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}