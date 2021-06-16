<template>
	<view class="weather">
		<view class="weather-nav">
			<view class="nav-back" @click="handleBackClick"><i class="uni-btn-icon"></i></view>
			<view class="nav-title">{{ currWeather.city }}</view>
		</view>
		<view class="weather-main">
			<view class="weather-icon">
				<image :src="getImageUrl(currWeather.weather).bg"></image>
				<view class="icon-info">
					<view class="info-value">
						<view class="value">{{ currWeather.temperature }}</view>
						<view class="symbol">°</view>
					</view>
					<view class="info-label">{{ currWeather.weather }}</view>
				</view>
				<view class="info-details">
					<view class="detail-item">
						<view class="detail-icon"><image src="../../static/weather/icon_wind.png"></image></view>
						<view class="detail-label">{{ currWeather.winddirection }}</view>
					</view>
					<view class="detail-item">
						<view class="detail-icon"><image src="../../static/weather/icon_speed.png"></image></view>
						<view class="detail-label">{{ currWeather.windpower }}m/s</view>
					</view>
					<view class="detail-item">
						<view class="detail-icon"><image src="../../static/weather/icon_hum.png"></image></view>
						<view class="detail-label">{{ currWeather.humidity }}%</view>
					</view>
				</view>
			</view>
			<view class="weather-list">
				<view v-for="(item, index) in weather.casts" :key="index" class="weather-item">
					<template v-if="index === 0">
						<view class="item-date">今天</view>
					</template>
					<template v-else>
						<view class="item-date">{{ handleWeek(item.week) }}</view>
					</template>
					<view class="item-info">{{ item.daytemp }}°-{{ item.nighttemp }}°</view>
					<view class="item-icon"><image :src="getImageUrl(item.dayweather).icon"></image></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
	computed: {
		...mapGetters(['weather']),
	},
	data() {
		return {
			currWeather: {}
		};
	},
	onLoad(option) {
		this.currWeather = JSON.parse(option.w)
	},
	methods: {
		// 返回上一页
		handleBackClick() {
			uni.navigateBack();
		},
		// week转换成中文
		handleWeek(week) {
			switch (week) {
				case '1':
					return '周一';
				case '2':
					return '周二';
				case '3':
					return '周三';
				case '4':
					return '周四';
				case '5':
					return '周五';
				case '6':
					return '周六';
				case '7':
					return '周日';
			}
		},
		// weather转换成图标
		handleWeather(data) {
			var str = '';
			switch (data) {
				case '晴':
					str = 'sun';
					break;
				case '阴':
					str = 'clouds';
					break;
				case '雾':
					str = 'fog';
					break;
				case '雨':
					str = 'rain';
					break;
				case '多云':
					str = 'cloudy';
					break;
				case '阵雨':
					str = 'rain';
					break;
				case '小雨':
					str = 'rain';
					break;
				case '中雨':
					str = 'rain';
					break;
				case '大雨':
					str = 'rain';
					break;
				case '暴雨':
					str = 'rain';
					break;
				case '大暴雨':
					str = 'rain';
					break;
				case '特大暴雨':
					str = 'rain';
					break;
				case '小雨-中雨':
					str = 'rain';
					break;
				case '中雨-大雨':
					str = 'rain';
					break;
				case '大雨-暴雨':
					str = 'rain';
					break;
				case '暴雨-大暴雨':
					str = 'rain';
					break;
				case '大暴雨-特大暴雨':
					str = 'rain';
					break;
				case '雷阵雨':
					str = 'thunder';
					break;
				default:
					str = 'no';
			}
			return str;
		},
		getImageUrl(weather) {
		  const name = this.handleWeather(weather)
		  const thumb = {
			cloudy: require('../../static/weather/wea_fog.png'),
			clouds: require('../../static/weather/wea_overcast.png'),
			fog: require('../../static/weather/wea_fog.png'),
			rain: require('../../static/weather/wea_rain.png'),
			sun: require('../../static/weather/wea_sunny.png'),
			thunder: require('../../static/weather/wea_rain.png')
		  }
		  const avatar = {
			  cloudy: require('../../static/weather/cloudy.png'),
			  clouds: require('../../static/weather/overcast.png'),
			  fog: require('../../static/weather/overcast.png'),
			  rain: require('../../static/weather/rain.png'),
			  sun: require('../../static/weather/sunny.png'),
			  thunder: require('../../static/weather/rain.png')
		  }
		  return {icon: thumb[name], bg: avatar[name]}
		}
	}
};
</script>

<style lang="scss">
.weather {
	.weather-nav {
		position: fixed;
		top: 68rpx;
		width: 100%;
		text-align: center;
		z-index: 2;
		color: #fff;
		.nav-back {
			position: absolute;
			left: 30rpx;
		}
	}
	.weather-icon {
		position: relative;
		text-align: center;
		image {
			width: 100%;
			height: 1000rpx;
		}
		.icon-info {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
		}
		.info-value {
			position: relative;
			font-size: 200rpx;
			font-weight: 400;
			color: rgba(255, 255, 255, 1);
			text-shadow: 0px 0px 35rpx rgba(0, 0, 0, 0.09);
			.symbol {
				position: absolute;
				position: absolute;
				top: 0;
				right: -75rpx;
			}
		}
		.info-label {
			font-size: 42rpx;
			font-weight: bold;
			color: rgba(255, 255, 255, 1);
			text-shadow: 0px 0px 2rpx rgba(0, 0, 0, 0.09);
		}
		.info-details {
			display: flex;
			align-items: center;
			position: absolute;
			width: 100%;
			bottom: 200rpx;
			.detail-item {
				flex: 1;
			}
			.detail-icon {
				display: inline-block;
				vertical-align: middle;
				padding-right: 11rpx;
			}
			.detail-label {
				display: inline-block;
				vertical-align: middle;
				font-size: 32rpx;
				color: #fff;
			}
			image {
				width: 34rpx;
				height: 34rpx;
			}
		}
	}
	.weather-list {
		padding: 40rpx;
		.weather-item {
			display: flex;
			align-items: end;
			font-size: 32rpx;
			padding: 39rpx 0;
			border-bottom: 1px solid rgba(196, 196, 196, 1);
			&:first-child {
				color: #286ee2;
			}
			.item-date {
			}
			.item-info {
				flex: 1;
				text-align: right;
				padding-right: 32rpx;
			}
			.item-icon {
				image {
					width: 48rpx;
					height: 48rpx;
				}
			}
		}
	}
}
</style>
