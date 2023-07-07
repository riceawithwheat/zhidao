import { createApp } from 'vue'
import axios from 'axios'
import router from './router'
import store from './store'
import App from './App.vue'
import 'easymde/dist/easymde.min.css'
// 改变loader出现状态的拦截器
axios.interceptors.request.use(config => {
  store.commit('setLoading', true)
  store.commit('setError', { status: false, message: ' ' })
  return config
  // console.log(store.state)
})
axios.interceptors.response.use(config => {
  setTimeout(() => {
    store.commit('setLoading', false)
  }, 1000)
  return config
}, e => {
  if (e.response) {
    const { error } = e.response
    store.commit('setError', { status: true, message: error })
    store.commit('setLoading', false)
  }
  return Promise.reject(e.response)
})
axios.defaults.baseURL = 'https://www.mmdemagic.top'
axios.defaults.headers.post['Content-Type'] = 'multipart/form-data'
const app = createApp(App)
app.use(router)
app.use(store)
app.mount('#app')
