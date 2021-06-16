<template>
	<view class="my">
		<view class="my-main">
			<view class="my-user">
				<image src="../../static/login/default.png" mode="aspectFit" style="width: 200rpx;height: 200rpx;"></image>
				<view style="margin-top: 20rpx;">{{ userInfo.username }}</view>
			</view>
			<view class="my-list">
				<view class="my-item">
					<view class="item-main" @click="handleJump('/pages/user/about')">
						<view class="item-icon"><image src="../../static/my/btn_message.png"></image></view>
						<view class="item-text">个人信息</view>
						<view class="item-desc"><image src="../../static/my/btn_next.png"></image></view>
					</view>
				</view>
				<view class="my-item">
					<view class="item-main" @click="handleJump('/pages/notice/index')">
						<view class="item-icon"><image src="../../static/my/btn_password.png"></image></view>
						<view class="item-text">修改密码</view>
						<view class="item-desc"><image src="../../static/my/btn_next.png"></image></view>
					</view>
				</view>
				<view class="my-item">
					<view class="item-main" @click="handleJump('/pages/user/about')">
						<view class="item-icon"><image src="../../static/my/btn_about.png"></image></view>
						<view class="item-text">关于我们</view>
						<view class="item-desc"><image src="../../static/my/btn_next.png"></image></view>
					</view>
				</view>
				<view class="my-item">
					<view class="item-main">
						<view class="item-icon"><image src="../../static/my/btn_version.png"></image></view>
						<view class="item-text">版本信息</view>
						<view class="item-desc">{{ version }}</view>
					</view>
				</view>
			</view>
			<view class="my-signout"><button @click="handleSignout">退出登录</button></view>
		</view>
	</view>
</template>

<script>
import { mapGetters } from 'vuex';
import { removeToken } from '@/utils/auth';
export default {
	data() {
		return {
			version: '1.0.0',
			userInfo: null
		};
	},
	computed: {
		...mapGetters(['info'])
	},
	created() {
		this.userInfo = this.info.id ? this.info : uni.getStorageSync('userInfo')
		// #ifdef APP-PLUS
		  this.version = plus.runtime.version
		// #endif
	},
	methods: {
		// 跳转
		handleJump(url) {
			uni.navigateTo({url});
		},
		handleSignout() {
			uni.showModal({
				title: '提示',
				content: '此操作将退出当前系统, 是否继续?',
				cancelText: '取消',
				confirmText: '确定',
				success: function(res) {
					if (res.confirm) {
						removeToken()
						uni.navigateTo({
							url: '/pages/user/login'
						})
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});
		}
	}
};
</script>

<style lang="scss">
page {
	background: #efeff1;
}
.my-signout {
	position: absolute;
	width: 100%;
	bottom: 95rpx;
	uni-button {
		width: 90%;
		height: 83rpx;
		line-height: 83rpx;
		background: #0EAE9D;
		color: #ffffff;
		border-radius: 10rpx;
	}
}
.my-main {
	background: #ffffff;
	.user-main {
		display: flex;
		align-items: center;
		border-bottom: 1rpx solid #ececec;
		padding-bottom: 30rpx;
	}
	.my-user {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		color: #FFFFFF;
		width: 100%;
		height: 470rpx;
		background: url(../../static/login/bg_me.png);
		background-size:cover;
		text-align: center;
	}
	.item-main {
		display: flex;
		align-items: center;
		border-bottom: 1rpx solid #ececec;
		padding-bottom: 32rpx;
	}
	.my-item {
		padding: 30rpx 30rpx 0 29rpx;
		image {
			width: 30rpx;
			height: 30rpx;
		}
		.item-text {
			font-size: 26rpx;
			color: #666666;
			padding-left: 23rpx;
		}
		.item-desc {
			font-size: 26rpx;
			color: #9a9a9a;
			flex: 1;
			text-align: right;
			image {
				width: 13rpx;
				height: 25rpx;
			}
		}
	}
}
</style>
