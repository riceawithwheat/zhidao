<template>
  <div class="column-detail-page w-75 mx-auto">
    <div class="column-info row mb-4 border-bottom pb-4 align-items-center" v-if="column">
     <div class="col-3 text-center">
        <!-- column没有fitUrl属性？ -->
        <img :src="column[0].avatarUrl" :alt="column[0].title" class="rounded-circle border w-100">
      </div>
      <div class="col-9">
        <h4>{{ column[0].title }}</h4>
        <p class="text-muted">{{ column[0].description }}</p>
      </div>
    </div>
    <post-list :list="list"></post-list>
  </div>
</template>
<script lang="ts">
import { ref, defineComponent, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import PostList from '../components/PostList.vue'
import { useStore } from 'vuex'
import { GlobalDataProps } from '@/store'
export default defineComponent({
  components: {
    PostList
  },
  setup () {
    const route = useRoute()
    const store = useStore<GlobalDataProps>()
    const currentId = ref(route.params.id)
    // console.log(currentId)
    const payload = {
      current: '1',
      size: '5'
    }
    onMounted(() => {
      store.dispatch('fetchColumn')
      store.dispatch('fetchAllPost', payload)
    })
    // 不理解该跳转 发生变化时跳转
    watch(() => route.params, (toParams) => {
      const jumpId = toParams && toParams.id
      const column = store.state.user.column
      if (jumpId && column && (jumpId === column)) {
        store.dispatch('fetchColumn')
        store.dispatch('fetchAllPost', payload)
        currentId.value = toParams.id
      }
    })
    const column = computed(() => {
      const selectColumn = store.getters.getColumnById(currentId.value)
      // if (selectColumn) {
      //   addColumnAvatar(selectColumn, 100, 100)
      // }
      const result = { ...selectColumn }
      // console.log(result)
      return result
    })
    // console.log(currentId.value)
    const list = computed(() => store.getters.getPostsByCid(currentId.value))
    return {
      column,
      list
    }
  }
})
</script>
