/*
 * @Author: showier
 * @since: 2020-08-28 10:34:49
 * @lastTime: 2020-09-18 15:57:52
 * @LastAuthor: Do not edit
 * @FilePath: \toncentsoft-et\src\api\back.js
 * @Description: 后台API
 */
import request from '@/utils/request'

// 用户列表
export function getUsers(params, encryptType=1) {
  return request({
    url: `/users`,
    method: 'get',
    params: { ...params, encryptType }
  })
}
// 新增用户
export function postUser(params, encryptType=1) {
  return request({
    url: `/users`,
    method: 'post',
    params: { encryptType },
    data: params
  })
}
// 更新用户
export function updateUser(params, encryptType=1) {
  return request({
    url: `/users`,
    method: 'put',
    params: { encryptType },
    data: params
  })
}
//删除用户
export function removeUsers(id, encryptType=1) {
  return request({
    url: `/users/deleteUserInfo/${id}`,
    method: 'delete',
    params: {encryptType}
  })
}
// 重置用户密码
export function updateUserPwd(params, encryptType=1) {
  return request({
    url: `/users/initialization`,
    method: 'put',
    params: { encryptType },
    data: params
  })
}
// 下载用户导入模板
export function getUserTemp(params, encryptType=1) {
  return request({
    url: `/users/excelTemplate`,
    method:'get',
    params: { ...params, encryptType }
  })
}

// 用户数据导出
export function getUserExport(params, encryptType=1) {
  return request({
    url: `/users/batch`,
    method: 'get',
    params: { ...params, encryptType }
  })
}

// 用户数据导入
export function postUserImport(params, encryptType=0) {
  return request({
    url: `/users/batch`,
    method: 'post',
    params: { encryptType },
    data: params
  })
}

/**
 * @description: 角色列表
 * @param {type} null
 * @return {type} null
 */
export function getRoles(params, encryptType=1) {
  return request({
    url: '/roles',
    method: 'get',
    params: { ...params, encryptType }
  })
}

// 获取所有角色
export function getRoleAll(params, encryptType=1) {
  return request({
    url: `/roles/all`,
    method: 'get',
    params: { ...params, encryptType }
  })
}

// 获取角色标识
export function getRoleMark(params, encryptType=1) {
  return request({
    url: `/roles/roleIdentity`,
    method: 'get',
    params: { ...params, encryptType}
  })
}

// 新增角色
export function postRole(params, encryptType=1) {
  return request({
    url: `/roles`,
    method: 'post',
    params: { encryptType },
    data: params
  })
}

// 更新角色
export function updateRole(params, encryptType=1) {
  return request({
    url: `/roles`,
    method: 'put',
    params: { encryptType },
    data: params
  })
}

// 删除角色
export function removeRole(id, encryptType=1) {
  return request({
    url: `/roles/${id}`,
    method: 'delete',
    params: { encryptType }
  })
}

// 获取菜单列表
export function getMenus(params, encryptType=1) {
  return request({
    url: `/resources/getBackPageMoudle`,
    method: 'get',
    params: { ...params, encryptType }
  })
}
export function getWebMenus(params, encryptType=1) {
  return request({
    url: `/resources/getFrontPageMoudle`,
    method: 'get',
    params: { ...params, encryptType }
  })
}
// 保存菜单
export function postMenu(params, encryptType=1) {
  return request({
    url: `/resources`,
    method: 'post',
    params: { encryptType },
    data: params
  })
}

// 更新菜单
export function updateMenu(params, encryptType=1) {
  return request({
    url: `/resources`,
    method: 'put',
    params: { encryptType },
    data: params
  })
}

// 删除菜单
export function removeMenu(id, encryptType=1) {
  return request({
    url: `/resources/${id}`,
    method: 'delete',
    params: { encryptType }
  })
}

// 获取角色权限拥有的菜单
export function getRoleMenu(id, encryptType=1) {
  return request({
    url: `/roles/${id}/getBackZTree`,
    method: 'get',
    params: { encryptType }
  })
}
// 获取前端角色权限拥有的菜单
export function getRoleWebMenu(id, encryptType=1) {
  return request({
    url: `roles/${id}/getFrontZTree`,
    method: 'get',
    params: { encryptType }
  })
}
// 角色菜单保存
export function postRoleMenu(params, encryptType=1) {
  return request({
    url: `/roleResources`,
    method: 'post',
    params: { encryptType },
    data: params
  })
}

// 登录日志
export function getLoginLog(params, encryptType=1) {
  return request({
    url: `/loginLog`,
    method: 'get',
    params: { ...params, encryptType }
  })
}

// 操作日志
export function getOperateLog(params, encryptType=1) {
  return request({
    url: `/operationLog`,
    method: 'get',
    params: { ...params, encryptType }
  })
}