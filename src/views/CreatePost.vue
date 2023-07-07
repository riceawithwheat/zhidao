<template>
    <div class="create-post-page">
        <h4>{{ isEditMode ? '编辑文章' : '新建文章' }}</h4>
        <uploader
        action="/uploader"
        :beforeUpload="uploadCheck"
        @file-uploaded="handleFileUploaded"
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
          <div class="uploaded-area">
            <img :src="dataProps.uploadedData && dataProps.uploadedData.data.url" >
            <h3>点击重新上传</h3>
          </div>
        </template>
      </uploader>
        <validate-form @form-submit="onFormSubmit">
        <div class="mb-3">
            <label class="form-label">文章标题：</label>
            <validate-input
            :rules="titleRules" v-model="titleVal"
            placeholder="请输入文章标题"
            type="text"></validate-input>
        </div>
        <div class="mb-3">
            <label class="form-label">文章详情：</label>
            <editor :options="editorOptions"
            v-model="contentVal"
            @blur="checkEditor"
            :class="{'is-invalid': !editorStatus.isValid}"
            >
          </editor>
            <span v-if="!editorStatus.isValid" class="invalid-feedback mt-1">{{ editorStatus.message }}</span>
        </div>
        <template #submit>
          <button class="btn btn-primary btn-large">{{ isEditMode ? '更新文章' : '发表文章' }}</button>
        </template>
    </validate-form>
    </div>
</template>
<script lang="ts">
import { defineComponent, ref, reactive, onMounted } from 'vue'
import { useStore } from 'vuex'
// import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'
import { GlobalDataProps, PostProps, ResponseType, ImageProps } from '@/store'
import ValidateForm from '../components/ValidateForm.vue'
import ValidateInput, { RulesProp } from '../components/ValidateInput.vue'
import Uploader from '@/components/Uploader.vue'
import { beforeUploadCheck } from '../helper'
import createMessage from '@/components/createMessage'
import { Options } from 'easymde'
import Editor from '@/components/Editor.vue'

export default defineComponent({
  name: 'CreatePost',
  components: {
    ValidateForm,
    ValidateInput,
    Uploader,
    Editor
  },
  setup () {
    const router = useRouter()
    const route = useRoute()
    const store = useStore<GlobalDataProps>()
    const editorStatus = reactive({
      isValid: true,
      message: ''
    })
    const isEditMode = !!route.query.id
    let imageId = ' '
    const uploadedData = ref()
    const titleVal = ref('')
    const textArea = ref<null | HTMLTextAreaElement>(null)
    // 配置editor的Option选项
    const editorOptions: Options = {
      spellChecker: false
    }
    const titleRules: RulesProp = [
      { type: 'required', message: '文章标题不能为空' }
    ]
    const contentVal = ref('')
    const contentRules: RulesProp = [
      { type: 'required', message: '文章详情不能为空' }
    ]
    onMounted(() => {
      if (isEditMode) {
        store.dispatch('fetcchPost', route.query.id).then((rawData: ResponseType<PostProps>) => {
          const currentPost = rawData.data
          if (currentPost.image) {
            uploadedData.value = { data: currentPost.image }
          }
          titleVal.value = currentPost.title
          contentVal.value = currentPost.content || ''
        })
      }
    })
    const handleFileUploaded = (rawData: ResponseType<ImageProps>) => {
      if (rawData.data._id) {
        imageId = rawData.data._id
      }
    }
    const checkEditor = () => {
      if (contentVal.value.trim() === '') {
        editorStatus.isValid = false
        editorStatus.message = '文章详情不能为空'
      } else {
        editorStatus.isValid = true
        editorStatus.message = ' '
      }
    }
    const onFormSubmit = (result: boolean) => {
      checkEditor()
      if (result && editorStatus.isValid) {
        const { column, _id } = store.state.user
        if (column) {
          const newPost: PostProps = {
            title: titleVal.value,
            content: contentVal.value,
            column,
            author: _id
          }
          if (imageId) {
            newPost.image = imageId
          }
          const actionName = isEditMode ? 'updatePost' : 'createPost'
          const sendData = isEditMode
            ? {
                id: route.query.id,
                payload: newPost
              }
            : newPost
          store.dispatch(actionName, sendData).then(() => {
            createMessage('发表成功，2秒后跳转到文章', 'success', 2000)
            setTimeout(() => {
              router.push({ name: 'column', params: { id: column } })
            }, 2000)
          })
        }
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
      handleFileUploaded,
      textArea,
      checkEditor,
      editorStatus,
      editorOptions,
      isEditMode
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
