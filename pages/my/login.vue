<template>
	<view class="login-main">
		<view class="title">uniapp模板</view>
		<view class="login-form">
			<view class="form-item">
				<view class="form-label"><image src="../../static/login/icon-user.png" mode="aspectFit" style="width: 30rpx;height: 30rpx;"></image></view>
				<view class="form-value"><input class="form-input" name="username" type="text" v-model="loginForm.username" placeholder="请输入账户" /></view>
			</view>
			<view class="form-item">
				<view class="form-label"><image src="../../static/login/icon-code.png" mode="aspectFit" style="width: 30rpx;height: 30rpx;"></image></view>
				<view class="form-value"><input class="form-input" name="password" type="password" v-model="loginForm.password" placeholder="请输入密码" /></view>
			</view>
			<view class="form-item">
				<view class="form-label"><image src="../../static/login/icon-yzm.png" mode="aspectFit" style="width: 30rpx;height: 30rpx;"></image></view>
				<view class="form-value"><input class="form-input" name="code" type="text" v-model="loginForm.code" placeholder="请输入验证码" /></view>
				<view class="form-code" @click="refreshCode"><v-captcha :identify-code="identifyCode" /></view>
			</view>
			<view class="form-item" style="border-bottom: none;color:#333333;" @click="rememberPsw = !rememberPsw">
				<checkbox value="rememberPsw" :checked="rememberPsw" style="transform:scale(0.9);" />记住密码
			</view>
		</view>
		<view class="login-submit"><button class="submit-button" @click="handleSubmitClick">登录</button></view>
	</view>
</template>

<script>
import { postLogIn } from '@/api/user.js';
import { setToken } from '@/utils/auth.js';
import graceChecker from '@/utils/graceChecker.js';
import Captcha from '@/components/Captcha';
export default {
	components: {
		'v-captcha': Captcha
	},
	data() {
		return {
			rememberPsw: false, // 记住密码
			identifyCodes: '1234567890', // 这里随机四个字符生成验证码
			identifyCode: '',
			loginForm: {
				username: '', // 用户名
				password: '', // 密码
				code: ''
			},
			loginRules: [
				{ name: 'username', checkType: 'notnull', checkRule: '', errorMsg: '账户不能为空' },
				{ name: 'password', checkType: 'notnull', checkRule: '', errorMsg: '密码不能为空' },
				{ name: 'code', checkType: 'notnull', checkRule: '', errorMsg: '验证码不能为空' }
			]
		};
	},
	onLoad() {
		this.makeCode(this.identifyCodes, 4);
	},
	mounted() {
		// #ifdef APP-PLUS
		setTimeout(() => {
		 plus.navigator.closeSplashscreen()
		}, 400);
		// #endif
		
		//缓存的账号/密码
        const HCuname = uni.getStorageSync('HCuname');
        const HCpassw = uni.getStorageSync('HCpassw');
        //有缓存就赋值给文本没有就清空
        if (HCuname && HCpassw) {
            this.loginForm.username = HCuname;
            this.loginForm.password = HCpassw;
        } else {
            this.loginForm.username = '';
            this.loginForm.password = '';
        }
	},
	methods: {
		// 登录method
		handleSubmitClick() {
			const checkRes = graceChecker.check(this.loginForm, this.loginRules);
			if (checkRes) {
				if (this.loginForm.code === this.identifyCode) {
				  this.postLogInHandle();
				} else {
					uni.showToast({ title: '验证码错误', icon: 'none' });
				}
			} else {
				uni.showToast({ title: graceChecker.error, icon: 'none' });
			}
		},
		// 登录API
		postLogInHandle() {
			postLogIn(this.loginForm).then(data => {
				//缓存账号和密码
				if (this.rememberPsw) {
					uni.setStorageSync('HCuname', this.loginForm.username);
					uni.setStorageSync('HCpassw', this.loginForm.password);
				}
				// 存储用户信息
				this.$store.dispatch('user/setInfo', data);
				uni.setStorageSync('userInfo', data);
				// 设置token并跳转
				setToken(data.token);
				uni.reLaunch({
					url: '/pages/index/index'
				});	
			});
		},
		// 刷新图片验证码
		refreshCode() {
			this.identifyCode = '';
			this.makeCode(this.identifyCodes, 4);
		},
		randomNum(min, max) {
			return Math.floor(Math.random() * (max - min) + min);
		},
		makeCode(o, l) {
			for (let i = 0; i < l; i++) {
				this.identifyCode += this.identifyCodes[this.randomNum(0, this.identifyCodes.length)];
			}
		}
	}
};
</script>

<style lang="scss">
page {
	height: 100%;
}
.login-main {
	height: 100%;
	margin: 20vh 0;
	.title {
		text-align: center;
		font-size: 44rpx;
		font-family: Source Han Sans CN;
		font-weight: 500;
		color: #004941;
		line-height: 120rpx;
	}
}
.login-form {
	padding: 10rpx 58rpx 0 58rpx;
	.form-item {
		position: relative;
		display: flex;
		align-items: center;
		border-bottom: 1px solid #e5e5e5;
		padding: 35rpx 15rpx;
	}
	.form-label {
		font-size: 28rpx;
		color: #f6f6f6;
	}
	.form-value {
		padding-left: 45rpx;
	}
	.form-code {
		position: absolute;
		right: 13rpx;
		top: 18rpx;
	}
}
.login-submit {
	z-index: 999;
	padding: 60rpx 82rpx 0 82rpx;
	.submit-button {
		color: #FFFFFF;
		background: linear-gradient(183deg, #0EAE9D, #1DDECA);
		box-shadow: 0px 0px 10rpx 0px rgba(25, 60, 109, 0.27);
		border-radius: 40rpx;
	}
}
</style>
