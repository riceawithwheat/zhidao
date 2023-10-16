/* eslint-disable indent */
import { createStore, Commit } from 'vuex'
import axios, { AxiosRequestConfig } from 'axios'
import persistedState from 'vuex-persistedstate'

export interface ImageProps {
  id?: string;
  url?: string;
  createdAt?: string;
  fitUrl?: string | undefined
}
export interface UserProps {
  isLogin: boolean;
  name?: string;
  id?: number;
  column?: string;
  columnId?: string;
  email?: string;
  // 根据后端改的
  avatar?: ImageProps;
  // avatarUrl?: string;
  description?: string;
}
export interface PostProps {
  id?: string;
  title: string;
  excerpt?: string;
  content?: string;
  image?: ImageProps | string;
  url?: string;
  createTime?: string;
  authorId?: number | UserProps;
  columnId?: string;
  // 干啥用的？
  isHTML?: boolean;
  profile?: string;
}
export interface ColumnProps {
    id: string;
    title: string;
    // 根据后端改的
    avatarUrl?: string;
    avatar?: ImageProps;
    description: string;
  }
export interface ColumnPost {
  file?: File;
  title: string;
  avatarUrl?: string;
  description: string;
}
interface ListProps<P> {
  [id: string]: P;
}
export interface GlobalErrorProps {
  status: boolean;
  message?: string;
}
export interface GlobalDataProps {
    error: GlobalErrorProps;
    token: string;
    loading: boolean;
    columns: { data: ListProps <ColumnProps>; current: string; total: number };
    // loadedColumns: string[];
    posts: { data: ListProps<PostProps>; myPosts: ListProps<PostProps> };
    user: UserProps;
}
export interface ResponseType <P=Record<string, never>> {
  code: number;
  msg: string;
  data: P;
}
// 封装axios
const asyncAndCommit = async (url: string, mutationName:string,
  commit: Commit, config: AxiosRequestConfig = { method: 'get' }, extraData?: any) => {
  console.log(url)
  const { data } = await axios(url, config)
  if (extraData) {
    commit(mutationName, { data, extraData })
  } else {
    commit(mutationName, data)
  }
  return data
}
const postAndCommit = async (url: string, mutationName: string, commit: Commit, payload?: any) => {
  console.log(url)
  const data = await axios.post(url, payload,
    {
      method: 'post',
      headers: {
        'Content-type': 'multipart/form-data'
      }
    })
  commit(mutationName, data)
  return data
}
const store = createStore<GlobalDataProps>({
  state: {
    error: { status: false },
    token: sessionStorage.getItem('token') || '',
    loading: false,
    columns: { data: {}, current: '0', total: 0 },
    posts: { data: {}, myPosts: {} },
    // loadedColumns: [],
    //  isLogin: false
    user: JSON.parse(localStorage.getItem('user')) || { isLogin: false }
    // user: { isLogin: false }
  },
  mutations: {
    createPost (state, newPost) {
      // console.log(newPost)
      state.posts.data[newPost.id] = newPost
    },
    createColumn (state, newColumn) {
      state.posts.data[newColumn.id] = newColumn
    },
    fetchColumn (state, rawData) {
      // console.log(rawData.data.data.id)
      if (rawData.id) {
        const { id } = rawData.data.data.id
        state.columns.data[id] = id
        state.user.columnId = id
      }
      // console.log(state.user)
    },
    fetchColumns (state, rawData) {
      const { data } = rawData.data
      // console.log(Array.from(data).length)
      state.columns = {
        data: data,
        total: Array.from(data).length,
        current: '1'
      }
      console.log(state.columns)
      // console.log(Array.from(data))
    },
    // 获取全部文章
    fetchAllPost (state, rawData) {
      console.log(state.token)
      console.log(rawData)
      const records = rawData.data.data.records
      state.posts.data = { ...state.posts.data, ...records }
      // console.log(state.posts.data)
      // const loadedId = { ...records.columnId }
      // state.posts.loadedColumns.push(loadedId)
    },
    fetchmyPosts (state, rawData) {
      console.log(rawData)
      const records = rawData.data.data.records
      state.posts.myPosts = { ...records }
      console.log(state.posts.myPosts)
    },
    deletePost (state, { data }) {
      // console.log(data)
      delete state.posts.myPosts[data]
    },
    updatePost (state, { data }) {
      console.log(state.posts.data[data.id])
      state.posts.data[data._id] = data
    },
    updateColumn (state, { data }) {
      // console.log(state.posts.data[data.id])
      state.posts.data[data.id] = data
    },
    setLoading (state, status) {
      state.loading = status
    },
    // 登录密码邮箱错误时操作
    setError (state, e: GlobalErrorProps) {
      state.error = e
    },
    setLogin (state, rawData) {
      state.user.isLogin = rawData
      // console.log(state.user.isLogin)
    },
    setUserCid (state, cid) {
      state.user.columnId = cid
      // console.log(state.user.columnId)
    },
    // 登录之后操作
    fetchCurrentUser (state, rawData) {
      localStorage.setItem('user', JSON.stringify(rawData.data))
      state.user = { isLogin: false }
      const { data } = rawData.data
      if (rawData.data.data) {
        state.user = {
          ...data,
          isLogin: true
        }
      }
      console.log(state.user)
    },
    login (state, rawData) {
      state.loading = false
      const token = rawData.data.data
      console.log('login')
      console.log(rawData)
      // 设置localstorage的值，每次登录初始化token
      localStorage.getItem('token')
      state.token = token
      axios.defaults.headers.token = `${token}`
      console.log(state.token)
    },
    // 删除token
    logout (state) {
      state.token = ' '
      state.user = { isLogin: false }
      state.columns = { data: {}, current: '0', total: 0 }
      state.posts = { data: {}, myPosts: {} }
      localStorage.removeItem('token')
      delete axios.defaults.headers.token
    }
  },
  actions: {
    // get还是post请求, 获取全部专栏
    fetchColumns ({ commit }) {
      return postAndCommit('/column/get/columnList', 'fetchColumns', commit)
    },
    // 获取我的专栏
    fetchColumn ({ commit }) {
        return postAndCommit('/column/get/authorColumnList', 'fetchColumn', commit)
    },
    // 获取全部该作者的全部文章
    fetchmyPosts ({ state, commit }) {
      const params = {
        current: '1',
        size: '3'
      }
      console.log(state.posts.myPosts)
      return postAndCommit('/essay/get/essayListByColumn', 'fetchmyPosts', commit, params)
    },
    // 上传文章并发布，或者更新文章
    fetchPost ({ state, commit }, id) {
      const currentPost = state.posts.data[id]
      if (!currentPost || !currentPost.content) {
        return postAndCommit('/essay/addOrUpdate/essay', 'fetchPost', commit)
      } else {
        return Promise.resolve({ data: currentPost })
      }
    },
    fetchAllPost ({ commit }) {
      const payload = {
        current: '1',
        size: '5'
      }
      return postAndCommit('/essay/get/essayList', 'fetchAllPost', commit, payload)
    },
    // 创建专栏
    createColumn ({ commit }, payload) {
      return postAndCommit('/column/add/column', 'createColumn', commit, payload)
    },
    // 更新专栏
    updateColumn ({ commit }, payload) {
      return asyncAndCommit('/column/add/column', 'updateColumn', commit, {
        method: 'patch',
        data: payload
      })
    },
    updatePost ({ commit }, { id, payload }) {
      return asyncAndCommit(`/posts/${id}`, 'updatePost', commit, {
        method: 'patch',
        data: payload
      })
    },
    // 跳转到上传文件表单
    createPost ({ commit }, payload) {
      console.log(payload)
      return postAndCommit('/essay/add/essay', 'createPost', commit, payload)
    },
    // 删除对应文章
    deletePost ({ commit }, id) {
      return postAndCommit('/essay/del/essay', 'deletePost', commit, id)
    },
    // 登录
    login ({ commit }, payload) {
      return postAndCommit('/common/token', 'login', commit, payload)
    },
    fetchCurrentUser ({ commit }) {
      return postAndCommit('/author/get/userInfo', 'fetchCurrentUser', commit)
    },
    loginAndFetch ({ dispatch }, loginData) {
      return dispatch('login', loginData).then(() => {
        return dispatch('fetchCurrentUser')
      })
    }
  },
  getters: {
    getColumns: (state) => {
      return state.columns.data
    },
    getColumnById: (state) => (cid: string) => {
      const list = Object.keys(state.columns.data).map(key => state.columns.data[key])
      const data = list.filter(item => Number(item.id).toString() === cid)
      console.log(data)
      return data
    },
    getPostsByCid: (state) => (cid: string) => {
      const list = Object.keys(state.posts.data).map(key => state.posts.data[key])
      const data = list.filter(item => Number(item.columnId).toString() === cid)
      console.log('myposts')
      console.log(state.posts)
      return data
    },
    getCurrentPost: (state) => (id:string) => {
      const list = Object.keys(state.posts.data).map(key => state.posts.data[key])
      const data = list.filter(item => Number(item.id).toString() === id)
      console.log(data)
      return data
    }
  },
  modules: {},
  plugins: [persistedState({ storage: window.sessionStorage })]
})
// 在应用初始化时，从 Local Storage 恢复状态
const storedState = JSON.parse(sessionStorage.getItem('vuex-state') || '{}')
store.replaceState({ ...store.state, ...storedState })

// 在页面刷新前，将状态存储到 Local Storage
window.addEventListener('beforeunload', () => {
  sessionStorage.setItem('vuex-state', JSON.stringify(store.state))
})
export default store
