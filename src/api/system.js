/*
 * @Author: showier
 * @Date: 2020-12-05 13:45:49
 * @LastEditTime: 2021-05-31 16:39:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \yl-admin\src\api\projectInfo.js
 */
import request from '@/utils/request'


// APP图片轮播
export function getAppImg(params, encryptType = 1) {
    return request({
        url: `/suppliesAppImage/appImageList`,
        method: 'get',
        params: {
            ...params,
            encryptType
        }
    })
}
export function postAppImg(data, encryptType = 1) {
    return request({
        url: `/suppliesAppImage/addAppImage`,
        method: 'post',
        params: {
            encryptType
        },
        data,
    })
}
export function putAppImg(data, encryptType = 1) {
    return request({
        url: `/suppliesAppImage/updateAppImage`,
        method: 'put',
        params: {
            encryptType
        },
        data,
    })
}
export function deleAppImg(id, encryptType = 1) {
    return request({
        url: `/suppliesAppImage/deleteAppImage/${id}`,
        method: 'delete',
        params: {
            encryptType
        },
    })
}


// APK管理
export function getApk(params, encryptType = 1) {
    return request({
        url: `/appUpgrade`,
        method: 'get',
        params: {
            ...params,
            encryptType
        }
    })
}
export function postApk(params, encryptType = 1) {
    return request({
        url: `/appUpgrade`,
        method: 'post',
        params: {
            encryptType
        },
        data: params
    })
}
export function putApk(params, encryptType = 1) {
    return request({
        url: `/appUpgrade`,
        method: 'put',
        params: {
            encryptType
        },
        data: params
    })
}
export function deleApk(id, encryptType = 1) {
    return request({
        url: `/appUpgrade/${id}`,
        method: 'delete',
        params: {
            encryptType
        }
    })
}
export function postApkFile(params, encryptType = 0) {
    return request({
        url: `/appUpgrade/uploadFile`,
        method: 'post',
        params: {
            encryptType
        },
        data: params
    })
}
export function putApkVersion(id, encryptType = 1) {
    return request({
        url: `/appUpgrade/${id}/release`,
        method: 'put',
        params: {
            encryptType
        }
    })
}
