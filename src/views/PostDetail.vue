<template>
    <div class="post-detail-page">
        <modal title="删除文章" :visible="modalIsVisible"
        @modal-on-close="modalIsVisible = false"
        @modal-on-confirm="hideAndDelete"
        >
        <p>确定要删除这篇文章吗？</p>
        </modal>
        <article class="w-75 mx-auto mb-5 pb-3" v-if="currentPost">
        <img :src="currentImageUrl" alt="currentPost.title" class="rounded-lg img-fluid my-4" v-if="currentImageUrl">
        <h2 class="mb-4">{{ currentPost.title }}</h2>
        <div class="user-profile-component border-top border-bottom py-3">
            <div class="col">
                <user-profile :user="currentPost.author"
                v-if="typeof currentPost.author === 'object'"
                ></user-profile>
            </div>
            <span class="text-muted col text-right font-italic">发表于：{{ currentPost.createdAt }}</span>
        </div>
            <div v-html="currentHTML"></div>
            <div v-if="showEditArea" class="btn-group mt-5">
            <route-link
             type="button" class="btn btn-success"
             :to="{name:'create',query: {id: currentPost._id}}">编辑
            </route-link>
            <button type="button" class="btn btn-danger" @click.prevent="modalIsVisible = true">删除</button>
            </div>
      </article>
    </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, computed, ref } from 'vue'
import UserProfile from '../components/UserProfile.vue'
import Modal from '@/components/Modal.vue'
import createMessage from '../components/createMessage'
import { useStore } from 'vuex'
import { GlobalDataProps, PostProps, UserProps, ImageProps, ResponseType } from '../store'
import { useRouter, useRoute } from 'vue-router'
import { marked } from 'marked'
export default defineComponent({
  name: 'post-detail',
  components: {
    UserProfile,
    Modal
  },
  setup () {
    const store = useStore<GlobalDataProps>()
    const route = useRoute()
    const router = useRouter()
    const modalIsVisible = ref(false)
    const currentId = route.params.id
    // const md = new MarkdownIt()
    onMounted(() => {
      store.dispatch('fetchPost', currentId)
    })
    const currentPost = computed<PostProps>(() => store.getters.getCurrentPost(currentId))
    const currentHTML = computed(() => {
      if (currentPost.value && currentPost.value.content) {
        const { isHTML, content } = currentPost.value
        //  此处有个编辑器的.marked
        return isHTML ? content : marked.parse(content)
      } else {
        return ''
      }
    })
    const showEditArea = computed(() => {
      const { isLogin, _id } = store.state.user
      if (currentPost.value && currentPost.value.author && isLogin) {
        const postAuthor = currentPost.value.author as UserProps
        return postAuthor._id === _id
      } else {
        return false
      }
    })
    const currentImageUrl = computed(() => {
      if (currentPost.value && currentPost.value.image) {
        const { image } = currentPost.value
        return (image as ImageProps).url + '?x-oss-process=image/resize,w_850'
      } else {
        return null
      }
    })
    const hideAndDelete = () => {
      modalIsVisible.value = false
      store.dispatch('deletePost', currentId).then((rawData: ResponseType<PostProps>) => {
        createMessage('删除成功，2秒后跳转到专栏', 'success', 2000)
        setTimeout(() => {
          // 加了一个toNumber()
          router.push({ name: 'column', params: { id: rawData.data.column } })
        })
      })
    }
    return {
      currentPost,
      currentImageUrl,
      currentHTML,
      showEditArea,
      modalIsVisible,
      hideAndDelete
    }
  }
})
</script>
<style>
</style>
