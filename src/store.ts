import { createStore, Commit } from 'vuex'
import axios, { AxiosRequestConfig } from 'axios'
import { arrToObj, objToArr } from './helper'
export interface ImageProps {
  _id?: string;
  url?: string;
  createdAt?: string;
  fitUrl?: string | undefined
}
export interface ColumnProps {
    _id: string;
    title: string;
    avatar?: ImageProps;
    description: string;
  }
export interface UserProps {
    isLogin: boolean;
    nickname?: string;
    _id?: string;
    column?: string;
    email?: string;
    avatar?: ImageProps;
    description?: string
}
export interface PostProps {
    _id?: string;
    title: string;
    excerpt?: string;
    content?: string;
    image?: ImageProps | string;
    createdAt?: string;
    column: string ;
    author?: string | UserProps;
    // 干啥用的？
    isHTML?: boolean;
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
    columns: { data: ListProps<ColumnProps>; currentPage: number; total: number };
    posts: { data: ListProps<PostProps>; loadedColumns: string[] };
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
  const { data } = await axios(url, config)
  if (extraData) {
    commit(mutationName, { data, extraData })
  } else {
    commit(mutationName, data)
  }
  return data
}
const getAndCommit = async (url: string, mutationName: string, commit: Commit) => {
  const { data } = await axios.get(url)
  commit(mutationName, data)
  return data
}
const postAndCommit = async (url: string, mutationName: string, commit: Commit, payload: any) => {
  const { data } = await axios.post(url, payload,
    {
      method: 'post',
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  commit(mutationName, data)
  return data
}
const store = createStore<GlobalDataProps>({
  state: {
    error: { status: false },
    token: localStorage.getItem('token') || '',
    // token: localStorage.getItem('token') ? localStorage.getItem('token') : '',
    loading: false,
    columns: { data: {}, currentPage: 0, total: 0 },
    posts: { data: {}, loadedColumns: [] },
    user: { isLogin: false, nickname: '游客' }
  },
  mutations: {
    // 测试用登录
    // login (state) {
    //   state.user = { ...state.user, isLogin: true, name: 'viking' }
    // },
    createPost (state, newPost) {
      state.posts.data[newPost._id] = newPost
    },
    fetchColumn (state, rawData) {
      state.columns.data[rawData.data._id] = rawData.data
    },
    fetchColumns (state, rawData) {
      const { data } = state.columns
      const { list, count, currentPage } = rawData.data

      state.columns = {
        data: { ...data, ...arrToObj(list) },
        total: count,
        currentPage: currentPage * 1
      }
    },
    fetchPosts (state, { data: rawData, extraData: columnId }) {
      state.posts.data = { ...state.posts.data, ...arrToObj(rawData.data.list) }
      state.posts.loadedColumns.push(columnId)
    },
    fetchPost (state, rawData) {
      state.posts.data[rawData.data._id] = rawData.data
    },
    deletePost (state, { data }) {
      delete state.posts.data[data._id]
    },
    updatePost (state, { data }) {
      state.posts.data[data._id] = data
    },
    setLoading (state, status) {
      state.loading = status
    },
    // 登录密码邮箱错误时操作
    setError (state, e: GlobalErrorProps) {
      state.error = e
    },
    setLogin (state) {
      state.user.isLogin = false
    },
    // 登录之后操作
    fetchCurrentUser (state, rawData) {
      state.user = { isLogin: true, ...rawData.data }
    },
    login (state, rawData) {
      const { token } = rawData.data
      state.token = token
      // 设置localstorage的值，每次登录初始化token
      localStorage.setItem('token', token)
      console.log(token)
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
    },
    // 删除token
    logout (state) {
      state.token = ' '
      state.user = { isLogin: false }
      localStorage.removeItem('token')
      delete axios.defaults.headers.common.Authorization
    }
  },
  actions: {
    // get还是post请求
    fetchColumns ({ state, commit }, params = {}) {
      const { currentPage = 1, pageSize = 6 } = params
      if (state.columns.currentPage < currentPage) {
        return asyncAndCommit('/column/get/columnList', 'fetchColumns', commit, { method: 'post' })
      }
      // return getAndCommit('https://www.mmdemagic.top/essay/get/essayListByColumn?current=<current>&size=<size>', 'fetchColumns', commit)
      // return postAndCommit(`https://www.mmdemagic.top/essay/get/essayListByColumn?current=${payload.current}&size=${payload.size}`, 'fetchColumns', commit, payload)
    },
    // 未确定url
    fetchColumn ({ state, commit }, cid) {
      if (!state.columns.data[cid]) {
        return asyncAndCommit(`/columns/${cid}`, 'fetchColumn', commit)
      }
      // return getAndCommit(`http://localhost:8080/api/column/${cid}`, 'fetchColumn', commit)
    },
    fetchPosts ({ state, commit }, cid) {
      if (!state.posts.loadedColumns.includes(cid)) {
        return asyncAndCommit(`/columns/${cid}/posts`, 'fetchPosts', commit, { method: 'get' }, cid)
      }
      // return getAndCommit(`https://www.mmdemagic.top/eaasy/get/column/${cid}/posts`, 'fetchPosts', commit)
    },
    // 上传文件并发布
    fetchPost ({ state, commit }, id) {
      const currentPost = state.posts.data[id]
      if (!currentPost || !currentPost.content) {
        return asyncAndCommit(`/posts/${id}`, 'fetchPost', commit)
      } else {
        return Promise.resolve({ data: currentPost })
      }
    },
    updatePost ({ commit }, { id, payload }) {
      return asyncAndCommit(`/posts/${id}`, 'updatePost', commit, {
        method: 'patch',
        data: payload
      })
    },
    // 跳转到上传文件表单
    createPost ({ commit }, payload) {
      return postAndCommit('/common/token', 'createPost', commit, payload)
    },
    // 删除对应文章
    deletePost ({ commit }, id) {
      return asyncAndCommit(`/posts/${id}`, 'deletePost', commit, { method: 'delete' })
    },
    // 登录
    login ({ commit }, payload) {
      return postAndCommit('/common/token', 'login', commit, payload)
    },
    fetchCurrentUser ({ commit }, payload) {
      return postAndCommit('/', 'fetchCurrentUser', commit, payload)
    },
    loginAndFetch ({ dispatch }, loginData) {
      return dispatch('login', loginData).then(() => {
        return dispatch('fetchCurrentUser')
        console.log(loginData)
      })
    }
  },
  getters: {
    getColumns: (state) => {
      return objToArr(state.columns.data)
    },
    getColumnById: (state) => (id: string) => {
      return state.columns.data[id]
    },
    getPostsByCid: (state) => (cid: string) => {
      return objToArr(state.posts.data).filter(post => post.column === cid)
    },
    getCurrentPost: (state) => (id:string) => {
      return state.posts.data[id]
    }
  }
})
export default store
