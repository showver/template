import Request from '@/utils/http'
import { getToken, removeToken, setToken } from './auth'
import config from '@/config'
import { getRefreshToken } from '@/api/user'

const errCode = [1001, 1003, 1005] // 1000 token失效 1003 修改当前账号退出 1005长时间不操作
Request.setConfig({
	baseUrl: config.domain
})
Request.interceptor.request = (config) => {
	config.header.token = getToken()
	return config
}
Request.updateToken = (config, token) => {
  config.header.token = token
  setToken(token)
}
// 是否正在刷新的标记
let isRefreshing = false
// 重试队列，每一项将是一个待执行的函数形式
let retryRequests = []
Request.interceptor.response = (resp, config) => {
	if (resp.code === 200) {
		return resp.data
	}
	if (errCode.includes(resp.code)) { // token过期，重新跳转登录页
	  let pages = getCurrentPages()
	  if(pages.length > 0) {
		  let route = pages[pages.length - 1].route
		  if (route !== '/pages/user/login') {
			uni.reLaunch({
				url: '/pages/user/login'
			});
		  }		  
	  } else {
		  uni.reLaunch({
		  	url: '/pages/user/login'
		  });
	  }
	  uni.stopPullDownRefresh();
	  removeToken()
	  return false
	}
	if (resp.code === 1004) {
		  if (!isRefreshing) {
			isRefreshing = true
			return getRefreshToken().then(data => {
			  const token = data
			  Request.updateToken(config, token)
			  retryRequests.forEach(cb => cb(token))
			  retryRequests = []
			  return Request.request(config)
			}).catch(_ => {
			  removeToken()
			  router.push('/login')
			}).finally(_ => {
			  isRefreshing = false
			})
		  } else {
			return new Promise(resolve => {
			  retryRequests.push(token => {
				config.header['token'] = token
				resolve(Request.request(config))
			  })
			})
		  }
	}
	uni.showToast({
	    title: resp.msg,
		icon: 'none',
	    duration: 2000
	});
	return Promise.reject()
}
export default Request