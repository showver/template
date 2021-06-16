<template>
	<view class="map-main">
		<web-view v-if="mapVisible" class="web" :style="{height: winHeight+'px'}" :src="url" @message="handleMessage"></web-view>
	</view>
</template>

<script>
import { mapGetters } from 'vuex';
import { getToken } from '@/utils/auth.js';
export default {
	data() {
		return {
			url: ``,
			mapVisible: true
		};
	},
	computed: {
		...mapGetters(['appInfo']),
		winHeight() {
			return this.appInfo.safeArea.height-50-44
		}
	},
	onReady() {
		// #ifdef APP-PLUS
		uni.onKeyboardHeightChange(res => {
		  if(res.height === 0) {
			  uni.showTabBar()
		  } else {
			uni.hideTabBar()  
		  }
		})
		// #endif
	},
	mounted() {
		this.getAreaSelection();
	},
	onShow() {
		this.mapVisible = true
	},
	onHide() {
		this.mapVisible = false
	},
	methods: {
		getAreaSelection() {
			console.log(getToken())
			this.url = `/hybrid/html/index.html?token=${getToken()}&id=360900`;
			// this.url = `http://192.168.1.18:9527?token=${getToken()}&id=${select}`
		},
		/**
		 * 接受来自webview的数据
		 */
		handleMessage(event) {
			console.log('接受到的消息', JSON.stringify(evt.detail.data));
		}
	}
};
</script>

<style>
</style>
