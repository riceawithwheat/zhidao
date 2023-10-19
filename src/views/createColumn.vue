<template>
    <div class="create-post-page container"  style="width: 800px;">
        <h4 style="font-weight: 700; font-size: 30px;">{{ isEditMode ? '编辑专栏' : '新建专栏' }}</h4>
        <uploader
        action="/pic/upload"
        category="column"
        :beforeUpload="uploadCheck"
        :uploaded="uploadedData"
        class="d-flex align-item-center justify-content-center text-center bg-light text-secondary w-50 my-4 ">
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
            <img :src="dataProps.uploadedData && dataProps.uploadedData"
            class="w-50 h-50" >
            <!-- <pre>{{ dataProps.uploadedData }}</pre> -->
            <h3>点击重新上传</h3>
          </div>
        </template>
      </uploader>
        <validate-form @form-submit="onFormSubmit">
        <div class="mb-3">
            <label class="form-label" style="font-weight: 700; font-size: 30px;">专栏标题：</label>
            <validate-input
            :rules="titleRules" v-model="titleVal"
            placeholder="请输入专栏标题"
            type="text"></validate-input>
        </div>
        <div class="mb-3">
            <label class="form-label" style="font-weight: 700; font-size: 30px;">专栏介绍：</label>
            <validate-input
            :rules="contentRules" v-model="contentVal"
            placeholder="请输入专栏介绍（200字以内）"
            type="text"
            style="display: inline-block !important;height: 200px !important;"
            ></validate-input>
            <span v-if="!editorStatus.isValid" class="invalid-feedback mt-1">{{ editorStatus.message }}</span>
        </div>
        <template #submit>
          <button class="btn btn-primary btn-large">{{ isEditMode ? '更新专栏' : '发表专栏' }}</button>
        </template>
    </validate-form>
    </div>
</template>
<script lang="ts">
import { defineComponent, ref, reactive } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { GlobalDataProps, ColumnPost } from '@/store'
import ValidateForm from '../components/ValidateForm.vue'
import ValidateInput, { RulesProp } from '../components/ValidateInput.vue'
import Uploader from '@/components/Uploader.vue'
import { beforeUploadCheck } from '../helper'
import createMessage from '@/components/createMessage'

export default defineComponent({
  name: 'createColumn',
  components: {
    ValidateForm,
    ValidateInput,
    Uploader

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
    const textArea = ref<null | HTMLTextAreaElement>(null)
    const imageUrl = ref('')
    const titleRules: RulesProp = [
      { type: 'required', message: '专栏标题不能为空' }
    ]
    const contentVal = ref('')
    const contentRules: RulesProp = [
      { type: 'required', message: '专栏详情不能为空' }
    ]
    const checkEditor = () => {
      if (!contentVal.value) {
        editorStatus.isValid = false
        editorStatus.message = '专栏详情不能为空'
      } else {
        editorStatus.isValid = true
        editorStatus.message = ' '
      }
    }

    const onFormSubmit = (result: boolean) => {
      checkEditor()
      const imgUrl = document.querySelector('img')
      if (result && editorStatus.isValid) {
        console.log('在创建专栏')
        const newColumn: ColumnPost = {
          title: titleVal.value,
          description: contentVal.value,
          avatarUrl: imgUrl.src
        }
        console.log(newColumn)
        const actionName = isEditMode ? 'updateColumn' : 'createColumn'
        const sendData = isEditMode ? { id: route.query.id, payload: newColumn } : newColumn
        store.dispatch(actionName, sendData).then((data) => {
          console.log(data)
          if (data.status === 200) {
            store.dispatch('fetchColumns')
            store.dispatch('fetchColumn')
            createMessage('发表成功，2秒后跳转到专栏', 'success', 2000)
            console.log(sendData)
            setTimeout(() => {
              router.push('/')
            }, 2000)
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
      textArea,
      checkEditor,
      editorStatus,
      isEditMode,
      upData,
      imageUrl
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
