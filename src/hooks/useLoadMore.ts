import { useStore } from 'vuex'
import { ref, computed, ComputedRef } from 'vue'

interface LoadParams {
    current: string;
    size: string;
}
const useLoadMore = (actionName: string, total: ComputedRef<number>,
  params: LoadParams = { current: '2', size: '6' }) => {
  const store = useStore()
  const current = ref(Number(params.current))
  console.log(current)
  const requestParams = computed(() => ({
    current: current.value,
    size: params.size
  }))
  console.log(requestParams.value)
  const loadMorePage = () => {
    store.dispatch(actionName, requestParams.value).then(() => {
      current.value++
    })
  }
  const isLastPage = computed(() => {
    const tempSize = Number(params.size)
    return Math.ceil(total.value / tempSize) < current.value
  })
  console.log(isLastPage)
  return {
    loadMorePage,
    isLastPage,
    current
  }
}
export default useLoadMore
