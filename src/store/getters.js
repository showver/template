/*
 * @Author: 1971167057@qq.com
 * @since: Do not edit
 * @lastTime: 2020-08-26 17:35:09
 * @LastAuthor: Do not edit
 * @FilePath: \vue-admin-pro\src\store\getters.js
 * @Description: vuex getters
 */
const getters = {
  sidebar: state => state.app.sidebar,
  projectId: state => state.app.projectId,
  type: state => state.app.type,
  device: state => state.app.device,
  menus: state => state.user.menus,
  routes: state => state.permission.routes,
  userInfo: state => state.user.userInfo
}
export default getters
