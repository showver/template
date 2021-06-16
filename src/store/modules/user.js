/*
 * @Author: showier
 * @since: 2020-08-26 14:52:36
 * @lastTime: 2020-08-26 15:17:38
 * @LastAuthor: Do not edit
 * @FilePath: \vue-admin-pro\src\store\modules\user.js
 * @Description: user状态
 */
import { getCurrMenus } from '@/api/user'
import { isEmpty } from '@/utils/serve';
const state = {
  menus: []
}

const mutations = {
  set_menus: (state, menus) => {
    state.menus = menus
  }
}

const actions = {
  setMenus({ commit }, menus) {
    commit('set_menus', menus)
  },
  getMenus({ commit }) {
    return new Promise((resolve, reject) => {
      getCurrMenus().then(data => {
        let arr = [];
        getMenusList(arr, data);
        /* 将菜单列表放入SessionStorage */
        sessionStorage.setItem('menuAuths', JSON.stringify(arr))
        commit('set_menus', arr)
        resolve(data)
      }).catch(err => {
        reject(err)
      })
    })
  }
}

let getMenusList = function (routers, data) {
  if (!isEmpty(data)) {
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
        if (!isEmpty(item.children)) {
          menu.children = [];
          getMenusList(menu.children, item.children)
        }
        routers.push(menu)
      }
    })
  }
  
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}