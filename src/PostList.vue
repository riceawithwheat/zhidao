<template>
  <!-- <pre>{{ posts }}</pre> -->
    <div class="post-list">
        <article v-for="post in posts" :key="post.id" class="card mb-3 shadow-sm">
          <div class="card-body">
            <h4><router-link :to="`/posts/${post.id}`">{{ post.title }}</router-link></h4>
             <div class="row my-3 align-items-center">
                <div v-if="post.url && typeof post.image !== 'string'" class="col-4">
                  <img :src="post.url" :alt="post.title" class="rounded-lg w-100">
                </div>
                <p :class="{'col-8': post.url}" class="text-muted">{{ post.profile}}</p>
              </div>
          </div>
          <span class="text-muted">{{post.createTime}}</span>
        </article>
        <!-- <button
        class="btn btn-outline-primary mt-2 mb-5 mx-auto btn-block w-25 d-block "
         @click="loadMorePage" v-if="!isLastPage"
      >
        加载更多
      </button> -->
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue'
import { PostProps } from '../store'
// import useLoadMore from '@/hooks/useLoadMore'

export default defineComponent({
  props: {
    list: {
      required: true,
      type: Array as PropType<PostProps[]>
    }
  },
  setup (props) {
    const posts = computed(() => {
      return props.list.map(post => {
        return post
      })
    })
    // const { loadMorePage, isLastPage } = useLoadMore('fetchColumns', , { size: '3', current: (current.value ? current.value + 1 : '2') })
    console.log(posts)
    return {
      posts
    }
  }
})
</script>
<style scoped>
.post-list h4 a {
  text-decoration: none;
  color:#1a1a1a;
}
.post-list h4 a:hover {
  color:#0d6efd;
}
</style>
