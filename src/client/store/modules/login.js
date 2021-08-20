import { SET_LOGIN_LOADING_STATE, SET_LOGIN_STATE } from '@/client/store/mutation-types'

const getInitialState = () => ({
  isLogin: false,
  isLoginLoading: false
})

export default {
  state: getInitialState(),

  getters: {
    isLogin: state => state.isLogin,
    isLoginLoading: state => state.isLoginLoading
  },

  actions: {
    fetchUserLogin ({ commit }) {
      commit(SET_LOGIN_LOADING_STATE, true)

      return new Promise((resolve, reject) => {
        window.ipc.once('CHECK_LOGIN', payload => {
          if (payload.error) {
            commit(SET_LOGIN_LOADING_STATE, false)
            reject(payload.error)
            return
          }

          commit(SET_LOGIN_STATE, payload.data.isLogin)
          commit(SET_LOGIN_LOADING_STATE, false)
          resolve()
        })

        window.ipc.send('CHECK_LOGIN')
      })
    },

    addAccount ({ commit }, payload) {
      commit(SET_LOGIN_LOADING_STATE, true)

      return new Promise((resolve, reject) => {
        window.ipc.once('ADD_ACCOUNT', payload => {
          if (payload.error) {
            commit(SET_LOGIN_LOADING_STATE, false)
            reject(payload.error)
            return
          }

          commit(SET_LOGIN_STATE, payload.data.isLogin)
          commit(SET_LOGIN_LOADING_STATE, false)
          resolve()
        })

        window.ipc.send('ADD_ACCOUNT', JSON.stringify(payload))
      })
    }
  },

  mutations: {
    [SET_LOGIN_STATE] (state, value) {
      state.isLogin = value
    },
    [SET_LOGIN_LOADING_STATE] (state, value) {
      state.isLoginLoading = value
    }
  }
}