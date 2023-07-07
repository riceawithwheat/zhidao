import { createApp } from 'vue'
import axios from 'axios'
import router from './router'
import store from './store'

import App from './App.vue'
import 'easymde/dist/easymde.min.css'
// 改变loader出现状态的拦截器
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  token && (config.headers.token = token)
  store.commit('setError', { status: false, message: ' ' })
  store.commit('setLoading', true)
  return config
})
axios.interceptors.response.use(
  config => {
    store.commit('setLoading', 'false')
    return config
  },
  e => {
    console.log(e.response)
    const { error } = e.response.data
    store.commit('setError', { status: true, message: error })
    store.commit('setLoading', false)
    return Promise.reject(e.response.data)
  })
axios.defaults.baseURL = 'https://www.mmdemagic.top'
axios.defaults.headers.post['Content-Type'] = 'multipart/form-data'
const app = createApp(App)
app.use(router)
app.use(store)
app.mount('#app')
