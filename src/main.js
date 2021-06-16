/*
 * @Author: showier
 * @since: 2020-08-25 15:13:51
 * @lastTime: 2020-09-03 10:12:24
 * @LastAuthor: Do not edit
 * @FilePath: \vue-admin-pro\src\main.js
 * @Description: 
 */
import Vue from 'vue'
import App from './App.vue'
import 'normalize.css/normalize.css'
import Element from 'element-ui'
import './styles/index.scss';

import router from './router'
import store from './store'
import { isBtnAuth } from '@/utils/auth'


import './permission' // 权限控制
Vue.use(Element)
Vue.config.productionTip = false
Vue.prototype.$isBtnAuth = isBtnAuth  // 功能权限

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#root')
