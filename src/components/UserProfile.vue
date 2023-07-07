<template>
  <div class="user-profile-component">
    <div class="d-flex align-item-center">
      <img :src="fitUrl" alt="user.nickName" class="rounded-circle img-thumbnail">
      <div class="detail ml-2">
        <h6 class="d-block mb-0">{{ user.name }}</h6>
        <span class="text-truncate text-muted d-block">{{ user.description }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from 'vue'
import { UserProps } from '../store'

export default defineComponent({
  props: {
    user: {
      type: Object as PropType<UserProps>,
      required: true
    }
  },
  setup (props) {
    const fitUrl = computed(() => {
      const data = props.user
      data.avatar = {
        fitUrl: require(data.description ? '@/assets/column.jpeg' : '@/assets/logo.png')
      }
      return data.avatar && data.avatar.fitUrl
    })
    return {
      fitUrl
    }
  }

})
</script>
<style>
</style>
