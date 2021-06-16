/*
 * @Author: 1971167057@qq.com
 * @since: Do not edit
 * @lastTime: 2020-08-25 17:14:22
 * @LastAuthor: Do not edit
 * @FilePath: \vue-admin-pro\src\store\modules\app.js
 * @Description: 项目配置信息
 */

const state = {
  sidebar: {
    opened: true,
    withoutAnimation: false
  },
  device: 'desktop',
  projectId: sessionStorage.getItem('projectId'),
  type:0,
}
const mutations = {
  toggle_sideBar: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
  },
  close_sideBar: (state, withoutAnimation) => {
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  get_projectId:(state,id)=>{
    state.projectId = id
  },
  get_type:(state,type)=>{
    state.type = type
  },
  toggle_device: (state, device) => {
    state.device = device
  }
}
const actions = {
  toggleSideBar({ commit }) {
    commit('toggle_sideBar')
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('close_sideBar', withoutAnimation)
  },
  toggleDevice({ commit }, device) {
    commit('toggle_device', device)
  },
  getProjectId({ commit }, id) {
    commit('get_projectId', id)
  },
  getType({ commit }, type) {
    commit('get_type', type)
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
