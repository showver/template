const state = {
	info: {},
	weather: {}
}

const mutations = {
	SET_INFO: (state, info) => {
		state.info = info
	},
	SET_WEATHER: (state, weather) => {
		state.weather = weather
	}
}

const actions = {
	setInfo({ commit }, info) {
		commit('SET_INFO', info)
	},
	setWeather({ commit }, weather) {
		commit('SET_WEATHER', weather)
	}
}

export default {
	namespaced: true,
	state,
	mutations,
	actions
}