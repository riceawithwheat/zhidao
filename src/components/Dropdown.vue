<template>
  <!-- 给dropdown加上ref属性，可以再ts中把标签获得 -->
  <div class="dropdown" ref="dropdownRef">
    <a href="#" class="btn btn-outline-light my-2 dropdown-toggle" @click.prevent="toggleOpen">
        {{ title }}
    </a>
    <ul class="dropdown-menu" :style="{display: 'block'}" v-if="isOpen">
      <slot></slot>
  </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import useClickOutside from '../hooks/useClickOutside'
import store from '../store'
export default defineComponent({
  name: 'DropDown',
  props: {
    title: {
      type: String,
      required: true,
      default: store.state.user.name
    }
  },
  setup () {
    const isOpen = ref(false)
    const dropdownRef = ref<null | HTMLElement>(null)
    // 切换下拉列表
    const toggleOpen = () => {
      isOpen.value = !isOpen.value
    }
    // 通过判断dropdown是否已经下拉，如果下拉，点击任意位置收起下拉菜单
    // const handler = (e: MouseEvent) => {
    //   if (dropdownRef.value) {
    //     if (!dropdownRef.value.contains(e.target as HTMLElement) && isOpen.value) {
    //       isOpen.value = false
    //     }
    //   }
    const isClickOutside = useClickOutside(dropdownRef)

    // 通过watch（）的回调函数进行isOpen值的随时调用
    // 假如直接在setup函数里写，只会执行一次
    watch(isClickOutside, () => {
      if (isOpen.value && isClickOutside.value) {
        isOpen.value = false
      }
    })
    return {
      isOpen,
      dropdownRef,
      toggleOpen
    }
  }
})
</script>
