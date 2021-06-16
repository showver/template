<template>
	<view class="plant_page_details alarm">
		<view class="alarm-nav">
			<view class="nav-tab">
				<view class="tab-item" :class="[alarmType === 'site' ? 'active' : '']" @click="handleType('site')">站点分类</view>
				<view class="tab-item" :class="[alarmType === 'para' ? 'active' : '']" @click="handleType('para')">参数分类</view>
			</view>
		</view>
		<view class="details_date">
			<view class="date-item" :class="form.timeType === 1?'active':''" @click="handleDate(1)">1小时</view>
			<view class="date-item" :class="form.timeType === 2?'active':''" @click="handleDate(2)">6小时</view>
			<view class="date-item" :class="form.timeType === 3?'active':''" @click="handleDate(3)">12小时</view>
			<view class="date-item" :class="form.timeType === 4?'active':''" @click="handleDate(4)">1天</view>
			<view class="date-item" :class="form.timeType === 5?'active':''" @click="handleDate(5)">3天</view>
		</view>
		<view class="details_content">		
			<view style="width: 70%;height: 300rpx;">
			  <qiun-data-charts type="ring" :opts="options1" :chartData="chartData1"/>
			</view>
		</view>
	</view>
</template>

<script>
	import { getAnalyPara, getAnalySite } from '@/api'
	import { getToken } from '@/utils/auth'
	export default {
		components: {},
		data() {
			return {
				alarmType: 'site',
				form: {
					timeType: 1, // 0:自定义时间，1：小时，2:6小时，3:12小时，4：一天，5:3天，6:7天，7:14天
					typeName: ''
				},
				chartData: [],
				chartData1: {
					series: [{
						data: [
						  {name: `正常 5`,value: 5}, 
						  {name: `告警 5`,value: 5}, 
						  {name: `离线 5`,value: 5}
						]
					}]
				},
				options1: {
					title: {name: "222"},
					subtitle: {"name": ""},
					padding: [10,5,10,5],
					color: ["#7bd66b", "#e84c4a", "#d9d9d9"],
					loadingType: 0,
					dataLabel: false,
					animation: false,
					legend:{position: 'right', itemGap: 100},
					extra:{ring:{ringWidth: 15,"customRadius": 54,activeRadius:5,border:false}},
				},
			}
		},
		onLoad(option) {
			this.form.typeName = option.name
		},
		onShow() {
			if (getToken()) {
			  this.fetchAnalySite()
			}
		},
		methods: {
			handleType(type) {
				this.alarmType = type
				type === 'site' ? this.fetchAnalySite() : this.fetchAnalyPara()
			},
			// 时间选择
			handleDate(val) {
				this.chartData = []
				this.form.timeType = val
				this.alarmType === 'site' ? this.fetchAnalySite() : this.fetchAnalyPara()
			},
			fetchAnalyPara() {
				this.chartData = []
				getAnalyPara(this.form).then(resp => {
					this.chartData = resp.data
				})
			},
			fetchAnalySite() {
				this.chartData = []
				getAnalySite(this.form).then(resp => {
					this.chartData = resp.data
				})
			}
		}
	}
</script>

<style lang="scss">
.alarm {
	.alarm-nav {
		position: fixed;
		padding-top: 68rpx;
		width: 100%;
		text-align: center;
		z-index: 2;
		color: #000;
		background-color: #ffffff;
		.nav-tab {
			position: relative;
			.tab-item {
				display: inline-block;
				vertical-align: middle;
				color: rgba(153, 153, 153, 0.9);
				font-size: 32rpx;
				padding: 0 30rpx;
				&.active {
					color: #000000;
					font-size: 36rpx;
				}
			}
		}
		.nav-filter {
			position: absolute;
			right: 42rpx;
			top: 6rpx;
			image {
				width: 32rpx;
				height: 35rpx;
			}
		}
	}
}
.plant_page_details{
	.details_date{
		display: flex;
		flex-flow: row wrap;
		align-items: center;
		text-align: center;
		font-size: 22rpx;
		padding: 140rpx 22rpx 40rpx 22rpx;
		.date-item{
			width: 108rpx;
			height: 48rpx;
			line-height: 48rpx;
			border-radius: 5rpx;
			background: #eeeeee;
			margin: 0 14rpx;
			margin-bottom: 14rpx;
			color: #666666;
			&.active{
				background: #0EAE9D;
				color: #FFFFFF;
			}
		}
	}
	.details_content{
		.chart_title{
			font-size: 32rpx;
			color: #333333;
			font-weight: 700;
			padding-left: 31rpx;
		}
	}
}
</style>
