
const state = {
	info: {}
}
const mutations = {
	SET_INFO: (state, info) => {
		state.info = info
	}
}
const actions = {
	setInfo({ commit }, info) {
		commit('SET_INFO', info)
	}
}

export default {
	namespaced: true,
	state,
	mutations,
	actions
}