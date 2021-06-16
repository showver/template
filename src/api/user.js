/*
 * @Author: showier
 * @since: 2020-08-25 16:39:25
 * @lastTime: 2020-09-29 10:07:43
 * @LastAuthor: Do not edit
 * @FilePath: \toncentsoft-et\src\api\user.js
 * @Description: user Api
 */
import request from '@/utils/request'

/**
 * @description: 登录
 * @param {type} encrypt_type 0 无加密 | 1 加密
 * @param {type} Object username 用户名
 * @param {type} Object password 密码
 * @return {type} Object token
 * @return {type} Object username 用户名
 * @return {type} Object telephone 手机号
 * @return {type} Object name 姓名
 * @return {type} Object needChangePaw 是否需要修改密码
 * @return {type} Object roleName 角色名称
 * @return {type} Object roleIdentity 角色标识
 */
export function getLogin(params, encryptType=1) {
  return request({
    url: `/login`,
    method: 'post',
    params: { encryptType },
    data: params
  })
}

/**
 * @description: 获取系统全部用户
 * @param {type} 
 * @return {type} 
 */
export function getUsers(params, encryptType=1) {
  return request({
    url: `/users/all`,
    method: 'get',
    params: { ...params, encryptType }
  })
}

/**
 * @description: 获取当前用户菜单
 * @param {type} encrypt_type 0 无加密 | 1 加密
 * @return {type} Array data
 */
export function getCurrMenus(params, encryptType=1) {
  return request({
    url: `/users/getBackMenu`,
    method: 'get',
    params: {...params, encryptType}
  })
}



/**
 * @description: 更新密码
 * @param {type} encrypt_type 0 无加密 | 1 加密
 * @return {type} 
 */
export function updateUserPwd(params, encryptType=1) {
  return request({
    url: `/users/chagePaw`,
    method: 'put',
    params: { encryptType },
    data: params
  })
}

// 刷新Token
export function getRefreshToken(params, encryptType=1) {
  return request({
    url: `/token/refresh`,
    method: 'get',
    params: {...params, encryptType },
  
  })
}



export function getProjectQuestionInfo(params, encryptType=1) {
  return request({
    url: `/projectQuestionInfo/projectQuestionInfoPage`,
    method: 'get',
    params: {...params, encryptType },
  
  })
}


export function deleteProjectQuestionInfo(id, encryptType=1) {
  return request({
    url: `/projectQuestionInfo/deleteProjectQuestionInfo/${id}`,
    method: 'delete',
    params: { encryptType },
  
  })
}
export function getupdateReadType(params, encryptType=1) {
  return request({
    url: `/projectQuestionInfo/updateReadType`,
    method: 'get',
    params: {...params, encryptType },
  
  })
}


// 用户站点维护
export function getUserSite(params, encryptType = 1) {
  return request({
      url: `/userSite/userSiteSelect`,
      method: 'get',
      params: {
          ...params,
          encryptType
      }
  })
}
export function postUserSite(data, encryptType = 1) {
  return request({
      url: `/userSite/userSiteAdd`,
      method: 'post',
      params: {
          encryptType
      },
      data
  })
}
