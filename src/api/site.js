/*
 * @Author: showier
 * @Date: 2020-12-05 13:45:49
 * @LastEditTime: 2021-04-28 19:47:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \yl-admin\src\api\projectInfo.js
 */
import request from '@/utils/request'


// 站点列表
export function getSiteInfo(params, encryptType = 1) {
    return request({
        url: `/siteInfo/siteInfoPage`,
        method: 'get',
        params: {
            ...params,
            encryptType
        }
    })
}
export function postSiteInfo(params, data, encryptType = 1) {
    return request({
        url: `/siteInfo/addSiteInfo`,
        method: 'post',
        params: {
            ...params,
            encryptType
        },
        data,
    })
}
export function putSiteInfo(params, data, encryptType = 1) {
    return request({
        url: `/siteInfo/updateSiteInfo`,
        method: 'put',
        params: {
            ...params,
            encryptType
        },
        data,
    })
}
export function deleSiteInfo(id, encryptType = 1) {
    return request({
        url: `/siteInfo/deleteSiteInfoByPressureSiteId/${id}`,
        method: 'delete',
        params: {
            encryptType
        },
    })
}
export function getTrigger(params, encryptType = 1) {
    return request({
        url: `/siteInfo/updateTriggerTypeByPressureSiteId`,
        method: 'get',
        params: {
            ...params,
            encryptType
        }
    })
}


// 站点图片
export function getSiteImg(params, encryptType = 1) {
    return request({
        url: `/siteRotate/siteRotateList`,
        method: 'get',
        params: {
            ...params,
            encryptType
        }
    })
}
export function postSiteImg(data, encryptType = 1) {
    return request({
        url: `/siteRotate/addSiteRotate`,
        method: 'post',
        params: {
            encryptType
        },
        data
    })
}
export function putSiteImg(params, data, encryptType = 1) {
    return request({
        url: `/siteRotate/updateSiteRotate`,
        method: 'put',
        params: {
            ...params,
            encryptType
        },
        data,
    })
}
export function deleSiteImg(id, encryptType = 1) {
    return request({
        url: `/siteRotate/deleteSiteRotate/${id}`,
        method: 'delete',
        params: {
            encryptType
        },
    })
}

// 参数类型
export function getSiteEquipment(params, encryptType = 1) {
    return request({
        url: `/siteEquipment/siteEquipmentPag`,
        method: 'get',
        params: {
            ...params,
            encryptType
        }
    })
}
export function postSiteEquipment(data, encryptType = 1) {
    return request({
        url: `/siteEquipment/addSiteEquipment`,
        method: 'post',
        params: {
            encryptType
        },
        data,
    })
}
export function putSiteEquipment(data, encryptType = 1) {
    return request({
        url: `/siteEquipment/updateSiteEquipment`,
        method: 'put',
        params: {
            encryptType
        },
        data,
    })
}
export function deleSiteEquipment(id, encryptType = 1) {
    return request({
        url: `/siteEquipment/deleteSiteEquipment/${id}`,
        method: 'delete',
        params: {
            encryptType
        },
    })
}

// 请求参数
export function getSiteParameter(params, encryptType = 1) {
    return request({
        url: `/siteParameter/siteParameterPag`,
        method: 'get',
        params: {
            ...params,
            encryptType
        }
    })
}
export function postSiteParameter(data, encryptType = 1) {
    return request({
        url: `/siteParameter/addSiteParameter`,
        method: 'post',
        params: {
            encryptType
        },
        data,
    })
}
export function putSiteParameter(data, encryptType = 1) {
    return request({
        url: `/siteParameter/updateSiteParameter`,
        method: 'put',
        params: {
            encryptType
        },
        data,
    })
}
export function deleSiteParameter(id, encryptType = 1) {
    return request({
        url: `/siteParameter/deleteSiteParameter/${id}`,
        method: 'delete',
        params: {
            encryptType
        },
    })
}

// 字段维护
export function getSiteField(params, encryptType = 1) {
    return request({
        url: `/siteField/siteFieldPag`,
        method: 'get',
        params: {
            ...params,
            encryptType
        }
    })
}
export function postSiteField(data, encryptType = 1) {
    return request({
        url: `/siteField/addSiteField`,
        method: 'post',
        params: {
            encryptType
        },
        data,
    })
}
export function putSiteField(data, encryptType = 1) {
    return request({
        url: `/siteField/updateSiteField`,
        method: 'put',
        params: {
            encryptType
        },
        data,
    })
}
export function deleSiteField(id, encryptType = 1) {
    return request({
        url: `/siteField/deleteSiteField/${id}`,
        method: 'delete',
        params: {
            encryptType
        },
    })
}

// 获取表信息
export function getTableInfo(params, encryptType = 1) {
    return request({
        url: `/tableInfo/getTableInfoDTO`,
        method: 'get',
        params: {
            ...params,
            encryptType
        }
    })
}
// 表头维护
export function getSiteTableHead(params, encryptType = 1) {
    return request({
        url: `/siteFieldReport/listData`,
        method: 'get',
        params: {
            ...params,
            encryptType
        }
    })
}
export function postSiteTableHead(params, data, encryptType = 1) {
    return request({
        url: `/siteFieldReport/siteFieldReport`,
        method: 'post',
        params: {
            ...params,
            encryptType
        },
        data,
    })
}
export function putSiteTableHead(params, data, encryptType = 1) {
    return request({
        url: `/siteFieldReport/siteFieldReport`,
        method: 'put',
        params: {
            ...params,
            encryptType
        },
        data,
    })
}
export function deleSiteTableHead(id, encryptType = 1) {
    return request({
        url: `/siteFieldReport/${id}`,
        method: 'delete',
        params: {
            encryptType
        },
    })
}

// 获取告警信息
export function getAlarm(params, encryptType = 1) {
    return request({
        url: `/siteAlarm/siteAlarmList`,
        method: 'get',
        params: {
            ...params,
            encryptType
        }
    })
}



export function getSystemNameByUse(encryptType = 1) {
    return request({
        url: `/systemName/systemNameByUser`,
        method: 'get',
        params: {
            encryptType
        }
    })
}
export function putSystemNameByUse(data, encryptType = 1) {
    return request({
        url: `/systemName/updateSystemName`,
        method: 'put',
        params: {

            encryptType
        },
        data
    })
}


export function getLoginImg(params, encryptType = 1) {
    return request({
        url: `/landingImage/energyLandingImageInfo`,
        method: 'get',
        params: {
            encryptType
        }
    })
}

export function postLoginImg(data, encryptType = 1) {
    return request({
        url: `/landingImage/energyLandingImageInfo`,
        method: 'post',
        params: {
            encryptType
        },
        data
    })
}

export function putLoginImg(params, data, encryptType = 1) {
    return request({
        url: `/landingImage/updateEnergyLandingImage`,
        method: 'put',
        params: {
            ...params,
            encryptType
        },
        data
    })
}


export function getUserProject(userId, encryptType = 1) {
    return request({
        url: `/projectUser/projectInfoListByUserId/${userId}`,
        method: 'get',
        params: {
            encryptType
        }
    })
}

export function getProjectRegionList(encryptType = 1) {
    return request({
        url: `/projectRegion/projectRegionList`,
        method: 'get',
        params: {
            encryptType
        }
    })
}



export function postElectrovalence(data, encryptType = 1) {
    return request({
        url: `/projectElectFee/insertEnergyProjectElectFeeBatch`,
        method: 'post',
        params: {
            encryptType
        },
        data
    })
}
export function getElectrovalence(params, encryptType = 1) {
    return request({
        url: `/projectElectFee/energyProjectElectFeeList`,
        method: 'get',
        params: {
            ...params,
            encryptType
        }
    })
}
export function postConsumptionBatch(data, encryptType = 1) {
    return request({
        url: `/projectConsumption/insertProjectConsumptionBatch`,
        method: 'post',
        params: {
            encryptType
        },
        data
    })
}

export function getConsumptionBatch(params, encryptType = 1) {
    return request({
        url: `/projectConsumption/projectConsumptionList`,
        method: 'get',
        params: {
            ...params,
            encryptType
        }
    })
}
export function relevanceProject(data, encryptType = 1) {
    return request({
        url: `/projectUser/insertProjectInfo`,
        method: 'post',
        params: {
            encryptType
        },
        data,

    })
}