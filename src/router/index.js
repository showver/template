/*
 * @Author: showier
 * @Date: 2020-12-02 09:03:35
 * @LastEditTime: 2021-04-28 19:19:11
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \yl-admin\src\router\index.js
 */
import Vue from 'vue'
import VueRouter from 'vue-router'

/*
在开发中不使用延迟加载，因为延迟加载太多的页面会导致webpack热更新太慢。
所以只有在生产中使用延迟加载
*/
const _import = require('./_import_' + process.env.NODE_ENV)

const Layout = require('@/layout').default

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: '登陆',
    component: _import('user/login'),
    title: '项目管理平台'
  },
  {
    path: '/forgot',
    name: '修改密码',
    component: _import('user/forgot'),
    title: '重置密码'
  },
  {
    path: '/',
    redirect: 'site/list',
    component: Layout,
    name: '首页',
    children: [{
        path: 'dashboard',
        component: _import('dashboard/index'),
        meta: {
          title: '首页总览',
          icon: 'dashboard',
          affix: true
        }
      },
      {
        path: '404',
        component: _import('error/NotFound'),
        meta: {
          title: '地址不存在'
        }
      },
      {
        path: '401',
        component: _import('error/NotFound'),
        meta: {
          title: '用户没有权限'
        }
      },
      // 用户管理
      {
        path: 'back/user',
        component: _import('back/user'),
        meta: {
          title: '用户管理'
        }
      },
      {
        path: 'back/role',
        component: _import('back/role'),
        meta: {
          title: '角色管理'
        }
      },
      {
        path: 'back/power',
        component: _import('back/power'),
        meta: {
          title: '权限管理'
        }
      },
      {
        path: 'back/login-log',
        component: _import('back/login-log'),
        meta: {
          title: '登录日志'
        }
      },
      {
        path: 'back/operate-log',
        component: _import('back/operate-log'),
        meta: {
          title: '操作日志'
        }
      },
      // 站点管理
      {
        path: 'site/list',
        component: _import('site/list'),
        meta: {
          title: '站点列表'
        }
      },
      {
        path: 'site/images',
        component: _import('site/images'),
        meta: {
          title: '站点图片'
        }
      },
      {
        path: 'site/equipment',
        component: _import('site/equipment'),
        meta: {
          title: '设备参数类型'
        }
      },
      {
        path: 'site/parameter',
        component: _import('site/parameter'),
        meta: {
          title: '设备请求参数'
        }
      },
      {
        path: 'site/field',
        component: _import('site/field'),
        meta: {
          title: '字段维护'
        }
      },
      {
        path: 'site/tableHead',
        component: _import('site/tableHead'),
        meta: {
          title: '表头维护'
        }
      },
      {
        path: 'site/alarm',
        component: _import('site/alarm'),
        meta: {
          title: '请求错误日志'
        }
      },
      // 系统管理
      {
        path: 'system/apk',
        component: _import('system/apk'),
        meta: {
          title: 'APK信息'
        }
      },
      {
        path: 'system/app',
        component: _import('system/app'),
        meta: {
          title: 'APP轮播图'
        }
      },
    ]
  },

]

const router = new VueRouter({
  routes
})

export default router