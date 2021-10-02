const state = () => ({
  _loadingDialogShow: false,
})

const getters = {
  loadingDialogShow: (state) => state._loadingDialogShow,
}

const actions = {
}

const mutations = {
  fireLoadingDialog(state) {
    state._loadingDialogShow = true
  },
  closeLoadingDialog(state) {
    state._loadingDialogShow = false
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}