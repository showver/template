<script>
	import { getUserInfo } from 'api/user.js'
	import { getToken } from 'utils/auth.js'
	import { mapGetters } from 'vuex'
	export default {
		onLaunch: function() {
			console.log('App Launch')
			if (getToken()) {
				// this.fetchUserInfo()
				uni.switchTab({
				    url: '/pages/index/home'
				});
			} else {
				uni.reLaunch({
					url: '/pages/user/login'
				})
			}
			if (Object.keys(this.appInfo).length <= 0) {
				this.fetchAppInfo()
			}
			uni.setStorageSync('first_key', true); // 第一次启动
		},
		onShow: function() {
			console.log('App Show')
			const flag = uni.getStorageSync('first_key')
			if (!flag) {
				if (getToken()) {
					// this.fetchUserInfo()
					uni.switchTab({
					    url: '/pages/index/home'
					});
				} else {
					uni.reLaunch({
						url: '/pages/user/login'
					})
				}
				if (Object.keys(this.appInfo).length <= 0) {
					this.fetchAppInfo()
				}
			} else {
				uni.setStorageSync('first_key', false); // 第一次启动
			}
		},
		onHide: function() {
			console.log('App Hide')
		},
		computed: {
			...mapGetters(['info', 'appInfo'])
		},
		methods:{
			/**
			 * 获取用户信息
			 * **/
			fetchUserInfo() {
				getUserInfo().then(data => {
					this.$store.dispatch('user/setInfo', data)
				})
			},
			/**
			 * 获取系统信息
			 * */
			fetchAppInfo() {
				const info = uni.getSystemInfoSync()
				this.$store.dispatch('app/setInfo', info)
			}
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>
