<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div class="home-page container">
      <TechComponent
      title="Cutting-Edge Technologies"
      description="Explore the latest advancements in the tech world."
    />
      <section class="py-5 text-center container">
        <div class="row py-lg-5">
          <div class="col-lg-6 col-md-8 mx-auto">
            <img src="../assets/column.jpg" alt="callout" class="w-75"/>
            <h2 class="font-weight-light">随心写作，自由表达</h2>
            <p>
              <router-link to="/create" class="btn btn-primary my-2 bg-gradient-primary">开始写文章</router-link>
            </p>
          </div>
        </div>
      </section>
      <h4 class="font-weight-bold text-center ">发现精彩</h4>
      <column-list :list="list"></column-list>
      <div class="text-center mx-auto my-2 btn-block">
        <router-link to="/createColumn" class="btn btn-primary bg-gradient-primary">创建我的专栏</router-link>
      </div>
      <button
        class="btn btn-outline-primary mt-2 mb-5 mx-auto btn-block w-25 d-block bg-gradient-primary"
         @click="loadMorePage" v-if="!isLastPage"
      >
        加载更多
      </button>
    </div>
  </template>

<script lang="ts">
import { defineComponent, onMounted, computed } from 'vue'
import { GlobalDataProps } from '../store'
import { useStore } from 'vuex'
import useLoadMore from '../hooks/useLoadMore'
import ColumnList from '../components/ColumnList.vue'
import TechComponent from '@/components/TechComponent.vue'

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Home',
  components: {
    ColumnList,
    TechComponent
  },
  setup () {
    const store = useStore<GlobalDataProps>()
    const total = computed(() => store.state.columns.total)
    const current = computed(() => store.state.columns.current)
    onMounted(() => {
      store.dispatch('fetchColumns', { size: 3 })
    })
    const list = computed(() => store.getters.getColumns)
    // console.log(list)
    const { loadMorePage, isLastPage } = useLoadMore('fetchColumns', total, { size: '3', current: (current.value ? current.value + 1 : '2') })
    return {
      list,
      loadMorePage,
      isLastPage
    }
  }
})
</script>
<style scoped>
.bg-gradient-primary {
  background-image: linear-gradient(45deg, #0099FF, #0c69d2);

}
</style>
