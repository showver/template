/*
 * @Author: your name
 * @Date: 2021-05-31 18:16:10
 * @LastEditTime: 2021-06-01 11:07:07
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \uniapp\api\user.js
 */
import Request from '../utils/request.js'

// 登录
export const postLogIn = (params) => Request.post('/login', params) 

// 用户信息
export const getUserInfo = (params) => Request.get('/users/userInfo', params)
export const putUserPaw = (params) => Request.put('/users/chagePaw', params)

// 检查版本更新
export const getSystemVersion = (params) => Request.get('/app/CheckAppUpgrade/checkIsLatestRelease', params)

// 刷新Token
export const getRefreshToken = (params) => Request.get('/token/refresh', params)