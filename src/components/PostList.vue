<template>
    <div class="post-list">
        <article v-for="post in posts" :key="post._id" class="card mb-3 shadow-sm">
          <div class="card-body">
            <h4><route-link :to="`/posts/${post._id}`">{{ post.title }}</route-link></h4>
             <div class="row my-3 align-items-center">
                <div v-if="post.image && typeof post.image !== 'string'" class="col-4">
                  <img :src="post.image.url" :alt="post.title" class="rounded-lg w-100">
                </div>
                <p :class="{'col-8': post.image}" class="text-muted">{{ post.content}}</p>
            </div>
          </div>
          <span class="text-muted">{{post.createdAt}}</span>
        </article>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue'
import { PostProps, ImageProps } from '../store'
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
        post.image as ImageProps
        return post
      })
    })
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
