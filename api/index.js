/*
 * @Author: your name
 * @Date: 2021-05-31 18:16:10
 * @LastEditTime: 2021-06-01 11:13:59
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \uniapp\api\index.js
 */
import Request from '../utils/request.js'

// 获取首页总览数据
export const getIndexOver = (params) => Request.get('/waterPlantData/queryWaterPlant', params)
// 获取轮播图
export const getSwiper = (params) => Request.get('/suppliesAppImage/appImageList', params)

// 获取统计信息
export const getGatewaySignal = (params) => Request.get('/siteInfo/siteGatewaySignalNumber', params)
export const getGatewayStatu = (params) => Request.get('/siteInfo/siteGatewayStatusNumber', params)

// 获取告警信息
export const getAlarm = (params) => Request.get('/siteAlarm/siteAlarmList', params)
export const getAlarmNotice = (params) => Request.get('/siteAlarm/unreadCount', params)
export const getAlarmRead = (id) => Request.get(`/siteAlarm/getReadSiteAlarm/${id}`)
export const getAlarmInfoAll = (params) => Request.get('/siteAlarm/alarmInformationAllCount', params)

// 实时数据
export const getRealData = (params) => Request.get('/realData/appRealDataDTOList', params)

// 站点列表
export const getSiteInfo = (params) => Request.get('/siteInfo/siteInfoPage', params)

// 折线图分析
export const getAnalySite = (params) => Request.get('/dataAnalysis/siteData', params)
export const getAnalyPara = (params) => Request.get('/dataAnalysis/dataParameter', params)

