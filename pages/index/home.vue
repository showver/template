<template>
	<view class="plant_page">
		<view class="plant_page_swiper" style="position:relative;margin:0;padding-top:68rpx;">
			<view class="weather" @click="handleWeatherRoute">
				<image src="../../static/weather/weather.png"></image>
				<view class="text">{{ currWeather.temperature }}°C</view>
				<view class="text">{{ currWeather.humidity }}%</view>
			</view>
			<swiper indicator-dots class="swiper">
				<swiper-item v-for="(item, index) in swiperData" :key="index">
					<image :src="item.appImagePath"></image>
				</swiper-item>
			</swiper>
		</view>
		<uni-card title="标题文字" thumbnail="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-dc-site/460d46d0-4fcc-11eb-8ff1-d5dcf8779628.png" extra="额外信息" note="Tips">
		    UI框架示例
		</uni-card>
	</view>
</template>

<script>
	import amap from '@/utils/amap-wx.js';
	import config from '@/config';
	import { getToken } from '@/utils/auth'
	import { getSystemVersion } from '@/api/user'
	import { getSwiper, getAlarm, getAlarmNotice } from '@/api'
	export default {
		data() {
			return {
				timer: null,
				alarmList: [], 
				swiperData: [], // 轮播图数据
				currWeather: {}, // 当前天气数据
				areaCode: '360900', // 区域Code
				noticeTotal: 0, // 通知总数
				overData: [], 
				socketTask: null // websocket
			}
		},
		onLoad() {
			// #ifdef APP-PLUS
			if (getToken()) {
				if (plus.os.name !== 'iOS') {
				  this.fetchSystemVersion()
				}				
			}
			// #endif
		},
		onHide() {
			if (this.socketTask && this.socketTask.close) {
				this.socketTask.close()
			}
			clearInterval(this.timer)
		},
		onShow() {
			if (getToken()) {
			  this.fetchSwiper()
			  this.fetchAlarm()
			  this.fetchAlarmNotice()
			}
		},
		mounted() {
			if (getToken()) {
				this.timer = setInterval( () => {
				    this.fetchAlarm()
					this.fetchAlarmNotice()
				}, 10000)
				// #ifdef APP-PLUS
				setTimeout(() => {
				  plus.navigator.closeSplashscreen()
				},400)
				// #endif
				const that = this;
				const amapFun = new amap.AMapWX({ key: 'a38a93e576e99e146b2a511d21cd5212' });
				amapFun.getWeather({
					type: 'forecast',
					city: that.areaCode,
					success: function(data) {
						//成功回调
						that.$store.dispatch('app/setWeather', data.forecast)
					},
					fail: function(info) {
						//失败回调
					}
				});
				amapFun.getWeather({
					city: that.areaCode,
					success: function(data) {
						that.currWeather = data.liveData
					},
					fail: function(info) {
					}
				})			
			}
		},
		methods: {
			// weather页面
			handleWeatherRoute() {
				uni.navigateTo({
					url: '../system/weather?w=' + JSON.stringify(this.currWeather)
				})
			},
			// notice页面
			handleNoticeRoute() {
				uni.navigateTo({
					url: '/pages/notice/index'
				});
			},
			handleDetails(url) {
				uni.navigateTo({ url })
			},
			fetchSwiper() {
				getSwiper().then(resp => {
				    this.swiperData = resp
				})
			},
			fetchAlarm() {
				const params = {
					page: 1,
					rows: 10,
					alarmOrNot: false
				}
				getAlarm(params).then(resp => {
				    this.alarmList = resp.rows
				})
			},
			fetchAlarmNotice() {
				getAlarmNotice().then(resp => {
					this.noticeTotal = resp || 0
				})
			},
			fetchSystemVersion() {
				const version = plus.runtime.version.split('.').join('')
				getSystemVersion({ versionCode : version }).then(data => {
					if (data) {
					// 提醒用户更新
					uni.showModal({
					    title: '版本更新',
					    content: '检查到新版本,是否更新?',
						cancelText: '暂不',
						confirmText: '现在下载',
					    success: (showResult) => {
					        if (showResult.confirm) {
					            plus.runtime.openURL(data.filePath);
					        }
					    }
					})	
					}
				})
			},
			modifyData(data) {
				for (const k in data) {
					const arr = data[k]
					this.overData.push({
						name: k,
						data: []
					})
					arr.map(el => {
						const obj = el
						const l = this.overData.length - 1
						for (const key in obj) {
							const j = obj[key]
							this.overData[l].data.push({
								name: j.fieldMeaning,
								unit: j.company,
								value: j.fieldValue,
								color: j.alarmColor
							})
						}
					})
				}
			},
			initWebsocket() {
				const i = config.domain.indexOf('//');
				const url = config.domain.slice(i);
				this.socketTask = uni.connectSocket({
					url: 'ws:'+url+'/websocketServer/waterPlantData',
					method: 'GET',
					success(res) {
						// 这里是接口调用成功的回调，不是连接成功的回调，请注意
					},
					fail(err) {
						// 这里是接口调用失败的回调，不是连接失败的回调，请注意
					}
				})
				this.socketTask.onOpen((res) => {
					console.log('onOpen', res);
				})
				this.socketTask.onError((err) => {
					console.log('onError', err);
				})
				this.socketTask.onMessage((res) => {
					this.overData = []
					const resp = JSON.parse(res.data);
					this.modifyData(resp.data);
				})
			}
		}
	}
</script>

<style lang="scss">
	.site-pre {
		width:100%;
		height:400rpx;
	}
	.charts-box {
		float: left;
		width: 50%;
		height: 400rpx;
		box-sizing: border-box;
		display: flex; 
		flex-flow: column nowrap;
		justify-content: center;
	}
	.charts-box:last-child {
		border-left: 1px dotted #c8f3e5;
	}
	
	.plant_page {
		font-size: 32rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #666666;
		position: relative;
		.status-bar {
			width: 100%;
			height: var(--status-bar-height);
			background: #FFFFFF;
			z-index: 2;
			position: fixed;
		}
		
		.weather {
			position: absolute;
			padding-top: 12rpx;
			padding-left: 30rpx;
			display: flex;
			align-items: center;
			z-index: 999;
			.text {
				display: inline-block;
				padding-left: 22rpx;
			}
		
			image {
				width: 34rpx;
				height: 30rpx;
			}
		}
		.news {
			height: 100%;
			z-index: 999;
			image {
				z-index: 999;
				position: absolute;
				top: 80rpx;
				right: 30rpx;
				width: 34rpx;
				height: 38rpx;
			}
		}
		.swiper {
			height: 420rpx;
			// padding-top: 88rpx;
			.uni-swiper-dot {
				background-color: #FFFFFF;
			}

			.uni-swiper-dot-active {
				background-color: #FFFFFF;
			}

			image {
				width: 100%;
				height: 420rpx;
			}
		}
	}
</style>
