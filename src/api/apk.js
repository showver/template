/*
 * @Author: showier
 * @since: 2020-09-01 10:07:04
 * @lastTime: 2020-09-01 14:15:09
 * @LastAuthor: Do not edit
 * @FilePath: \vue-admin-pro\src\api\apk.js
 * @Description: APK管理API
 */
import request from '@/utils/request'

// 获取APK列表
export function getApks(params, encryptType=1) {
  return request({
    url: `/appUpgrade`,
    method: 'get',
    params: { ...params, encryptType }
  })
}

// 新增APK
export function postApk(params, encryptType=1) {
  return request({
    url: `/appUpgrade`,
    method: 'post',
    params: { encryptType },
    data: params
  })
}

// 更新APK
export function updateApk(params, encryptType=1) {
  return request({
    url: `/appUpgrade`,
    method: 'put',
    params: { encryptType },
    data: params
  })
}

// 移除APK
export function removeApk(id, encryptType=1) {
  return request({
    url: `/appUpgrade/${id}`,
    method: 'delete',
    params: { encryptType }
  })
}

// 上传APK
export function postUpApk(params, encryptType=0) {
  return request({
    url: `/appUpgrade/uploadFile`,
    method: 'post',
    params: { encryptType },
    data: params
  })
}

// 发布APK版本
export function updateApkPublish(id, encryptType=1) {
  return request({
    url: `/appUpgrade/${id}/release`,
    method: 'put',
    params: { encryptType }
  })
}