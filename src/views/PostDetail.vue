<template>
    <div class="post-detail-page">
        <modal title="删除文章" :visible="modalIsVisible"
        @modal-on-close="modalIsVisible === false"
        @modal-on-confirm="hideAndDelete"
        >
        <p>确定要删除这篇文章吗？</p>
        </modal>
        <article class="w-75 mx-auto mb-5 pb-3" v-if="currentPost">
          <!-- <pre>{{ currentPost[0] }}</pre> -->
        <img :src="currentImageUrl" alt="currentPost.title" class="rounded-lg img-fluid my-4 " style="width: 300px;" v-if="currentImageUrl">
        <h2 class="mb-4">{{ currentPost[0].title }}</h2>
        <div class="user-profile-component border-top border-bottom py-3">
            <div class="col">
                <user-profile :user="currentPost[0].authorId"
                v-if="typeof ( currentPost[0].authorId) === 'object'"
                ></user-profile>
            </div>
            <span class="text-muted col text-right font-italic">发表于：{{ currentPost[0].createTime }}</span>
        </div>
            <div v-html="currentHTML"></div>
            <div v-if="showEditArea" class="btn-group mt-5">
              <router-link
              type="button" class="btn btn-success"
              :to="{name:'create',query: {id: currentPost.id}}">编辑
              </router-link>
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
import { GlobalDataProps, PostProps } from '../store'
import { useRouter, useRoute } from 'vue-router'
import { marked } from 'marked'
import axios from 'axios'
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
    const payload = {
      current: '1',
      size: '3'
    }
    // const md = new MarkdownIt()
    onMounted(() => {
      store.dispatch('fetchAllPost', { payload, cid: currentId })
    })
    const currentPost = computed<PostProps>(() => store.getters.getCurrentPost(currentId))
    const currentHTML = computed(() => {
      if (currentPost.value && currentPost.value[0].content) {
        const { isHTML, content } = currentPost.value[0]
        //  此处有个编辑器的.marked
        return isHTML ? content : marked.parse(content)
      } else {
        return ''
      }
    })
    const showEditArea = computed(() => {
      const { isLogin, id } = store.state.user
      if (currentPost.value[0] && currentPost.value[0].authorId && isLogin) {
        const postAuthor = currentPost.value[0].authorId
        // console.log(postAuthor)
        return postAuthor === id
      } else {
        return false
      }
    })
    const currentImageUrl = computed(() => {
      // console.log(currentPost.value[0].url)
      if (currentPost.value && currentPost.value[0].url) {
        // console.log('解析图片')
        const image = currentPost.value[0].url
        // console.log(image)
        return image + '?x-oss-process=image/resize,w_850'
      } else {
        return null
      }
    })
    const hideAndDelete = () => {
      modalIsVisible.value = false
      console.log(currentId)
      const id = currentId
      console.log(id)
      // eslint-disable-next-line no-template-curly-in-string
      axios.post(`/essay/del/essay?id=${id}`).then((rawData) => {
        store.commit('deletePost', { id })
        createMessage('删除成功，2秒后跳转到专栏', 'success', 2000)
        setTimeout(() => {
          // 加了一个toNumber()
          store.dispatch('fetchAllPost')
          console.log(store.state.posts)
          router.push({ name: 'column', params: { id: store.state.user.columnId } })
        }, 2000)
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
