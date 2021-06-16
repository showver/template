<!--
 * @Author: 1971167057@qq.com
 * @since: 2020-08-19 17:53:07
 * @lastTime: 2020-08-19 18:02:15
 * @LastAuthor: Do not edit
 * @FilePath: \water-plant-app\pages\collocation\index.vue
 * @Description: 启动页
-->
<template>
	<view>&nbsp;</view>
</template>

<script>
	export default {
		onLoad() {
			// 从本地缓存中同步获取指定 key 对应的内容，用于判断是否是第一次打开应用
			const value = uni.getStorageSync('launchFlag');
			if (value) {
				// 如何已经有，直接去home首页
				uni.switchTab({
					url: '/pages/index/index'
				});
			} else {
				// 没有值，跳到引导页，并存储，下次打开就不会进去引导页
				uni.setStorage({
					key: 'launchFlag',
					data: true
				});
				uni.redirectTo({
					url: '/pages/system/guide'
				});
			}
		}
	}
</script>