<template>
  <div class="create-post-page container">
      <h4 style="font-weight: 700; font-size: 30px;">{{ isEditMode ? '编辑文章' : '新建文章' }}</h4>
      <uploader
      action="/pic/upload"
      category="essay"
      :beforeUpload="uploadCheck"
      :uploaded="uploadedData"
      class="d-flex align-item-center justify-content-center bg-light text-secondary w-100 my-4 ">
      <h2>点击上传头图</h2>
      <template #loading>
        <div class="d-flex">
          <div class="spinner-border text-secondary" role="status">
              <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        <h2>正在上传</h2>
      </template>
      <template #uploaded="dataProps">
        <div class="uploaded-area" >
          <img :src="dataProps.uploadedData && dataProps.uploadedData"
          class="w-50 h-50"
          >
          <h3>点击重新上传</h3>
        </div>
      </template>
    </uploader>
      <validate-form @form-submit="onFormSubmit">
      <div class="mb-3">
          <label class="form-label" style="font-weight: 700; font-size: larger;">文章标题：</label>
          <validate-input
          :rules="titleRules" v-model="titleVal"
          placeholder="请输入文章标题"
          type="text"></validate-input>
      </div>
      <div class="mb-3">
          <label class="form-label" style="font-weight: 700; font-size: larger;">文章简介：</label>
          <validate-input
          :rules="profileRules" v-model="profileVal"
          placeholder="请输入文章简介"
          type="text"></validate-input>
      </div>
      <div class="mb-5">
          <label class="form-label" style="font-weight: 700; font-size: larger;">文章介绍：</label>
          <wang-edr
          v-model= "contentVal"
           @blur="checkEditor"
           :class="{'is-invalid': !editorStatus.isValid}">
          </wang-edr>
          <span v-if="!editorStatus.isValid" class="invalid-feedback mt-1">{{ editorStatus.message }}</span>
      </div>
      <template #submit>
        <button class="btn btn-primary btn-large">{{ isEditMode ? '更新文章' : '发表文章' }}</button>
      </template>
  </validate-form>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, reactive } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { GlobalDataProps, PostProps } from '@/store'
import ValidateForm from '../components/ValidateForm.vue'
import ValidateInput, { RulesProp } from '../components/ValidateInput.vue'
import Uploader from '@/components/Uploader.vue'
import createMessage from '@/components/createMessage'
import { beforeUploadCheck } from '@/helper'
import wangEdr from '../components/wangEdr.vue'

export default defineComponent({
  name: 'CreatePost',
  components: {
    ValidateForm,
    ValidateInput,
    Uploader,
    wangEdr
  },
  props: {
    modelValue: String
  },
  setup () {
    const uploadedData = ref()
    const router = useRouter()
    const route = useRoute()
    const store = useStore<GlobalDataProps>()
    const editorStatus = reactive({
      isValid: true,
      message: ''
    })
    const isEditMode = !!route.query.id
    const titleVal = ref('')
    const upData = ref('')
    const imageUrl = ref<null | HTMLElement>(null)
    const profileVal = ref('')
    const profileRules: RulesProp = [
      { type: 'required', message: '文章简介不能为空' }
    ]
    const titleRules: RulesProp = [
      { type: 'required', message: '文章标题不能为空' }
    ]
    const contentVal = ref('')
    const contentRules: RulesProp = [
      { type: 'required', message: '文章详情不能为空' }
    ]
    const checkEditor = () => {
      if (!contentVal.value) {
        editorStatus.isValid = false
        editorStatus.message = '文章详情不能为空'
      } else {
        editorStatus.isValid = true
        editorStatus.message = ' '
      }
    }
    const onFormSubmit = (result: boolean) => {
      checkEditor()
      const imgUrl = document.querySelector('img')
      if (result && editorStatus.isValid) {
        console.log('我在onFormSubmit')
        const column = store.state.user.columnId as string
        const newPost: PostProps = {
          title: titleVal.value,
          content: contentVal.value,
          url: imgUrl.src,
          columnId: column,
          profile: profileVal.value
        }
        console.log(newPost)
        const actionName = isEditMode ? 'updatePost' : 'createPost'
        const sendData = isEditMode ? { id: route.query.id, payload: newPost } : newPost
        store.dispatch(actionName, sendData).then((data) => {
          if (data.status === 200) {
            createMessage('发表成功，2秒后跳转到文章', 'success', 2000)
            setTimeout(() => {
              router.push('/')
            }, 2000)
          } else {
            createMessage('发表失败，请重新尝试', 'error', 2000)
          }
        })
      }
    }
    const uploadCheck = (file: File) => {
      const result = beforeUploadCheck(file, { format: ['image/jpeg', 'image/png'], size: 1 })
      const { passed, error } = result
      if (error === 'format') {
        createMessage('上传图片只能是JPG/PNG格式！', 'error')
      }
      if (error === 'size') {
        createMessage('上传图片大小不能超过1MB', 'error')
      }
      return passed
    }
    return {
      titleRules,
      titleVal,
      contentVal,
      contentRules,
      onFormSubmit,
      uploadedData,
      uploadCheck,
      checkEditor,
      editorStatus,
      isEditMode,
      upData,
      imageUrl,
      profileVal,
      profileRules
    }
  }
})
</script>
<style>
.create-post-page .file-upload-container {
height: 200px;
cursor: pointer;
overflow: hidden;
}
.create-post-page .file-upload-container img {
widows: 100%;
height: 100%;
object-fit: cover;
}
.uploaded-area {
position: relative;
}
.uploaded-area:hover h3 {
display: block;
}
.uploaded-area h3 {
display: none;
position: absolute;
color: #999;
text-align: center;
width: 100%;
top: 50%;
}
</style>
