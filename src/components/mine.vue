<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div class="personal-info container">
        <modal title="删除专栏" :visible="modalIsVisible"
        @modal-on-close="modalIsVisible = false"
        @modal-on-confirm="hideAndDelete"
        >
        <p>确定要删除专栏吗？</p>
        </modal>
        <div class="card text-center mb-2" style="width: 500px;">
            <div class="card-body">
                <h2 class="card-title mb-3">个人信息</h2>
                <h6 class="card-subtitle mb-2 text-muted">昵称： {{ user.name }}</h6>
                <p class="card-text">Email： {{ user.email }}</p>
                <a href="https://github.com/riceawithwheat/zhidao.git" class="card-link">Github</a>
                <a href="#" class="card-link">Email</a>
            </div>
        </div>
    <div>
        <div class="card text-center column-info row mb-4 border-bottom pb-4 align-items-center" v-if="column" style="width:  475px;">
            <h2 class="card-title mb-3 mt-3">你的专栏</h2>
            <div class="col-3 text-center mt-3">
                <img :src="column[0].avatarUrl" :alt="column[0].title" class="rounded-circle border w-100">
            </div>
            <div class="col-9 text-center mt-5">
                <h4>{{ column[0].title }}</h4>
                <p class="text-muted">{{ column[0].description }}</p>
            </div>
            <div v-if="showEditArea" class="btn-group mt-5">
              <button
              type="button" class="btn btn-success">编辑
            </button>
              <button type="button" class="btn btn-danger" @click.prevent="modalIsVisible = true">删除</button>
            </div>
        </div>
      </div>
    </div>
  </template>
<script lang="ts">
import { ref, defineComponent, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import axios from 'axios'
import { GlobalDataProps } from '@/store'
import createMessage from './createMessage'
import Modal from './Modal.vue'
export default defineComponent({
  components: {
    Modal
  },
  setup () {
    const router = useRouter()
    const store = useStore<GlobalDataProps>()
    const currentId = store.state.user.columnId
    const modalIsVisible = ref(false)
    const user = store.state.user
    const showEditArea = computed(() => {
      const { isLogin } = store.state.user
      if (currentId && isLogin) {
        return true
      } else {
        return false
      }
    })
    console.log(currentId)
    const column = computed(() => {
      const selectColumn = store.getters.getColumnById(currentId.toString())
      const result = { ...selectColumn }
      console.log(result)
      return result
    })
    const hideAndDelete = () => {
      modalIsVisible.value = false
      console.log(currentId)
      const id = column.value[0].id
      console.log(id)
      // eslint-disable-next-line no-template-curly-in-string
      axios.post(`/column/del/column?id=${id}`).then((rawData) => {
        createMessage('删除成功，2秒后跳转到创建专栏', 'success', 2000)
        setTimeout(() => {
          // 加了一个toNumber()
          store.dispatch('fetchColumns')
          console.log(store.state.columns)
          router.push('/createColumn')
        }, 2000)
      })
    }
    return {
      column,
      user,
      modalIsVisible,
      showEditArea,
      hideAndDelete
    }
  }
})
</script>
<style scoped>
  .personal-info {
    width: 500px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
  }

  h1 {
    font-size: 24px;
    margin-bottom: 10px;
  }

  p {
    font-size: 16px;
  }

  .column {
    margin-bottom: 20px;
  }
  </style>
