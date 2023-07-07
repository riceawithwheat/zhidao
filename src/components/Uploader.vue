<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div class="file-upload">
      <!-- @click.prevent="triggerUpload" -->
        <div class="file-upload-container" @click.prevent="triggerUpload">
         <slot v-if="fileStatus === 'loading'" name="loading" :beforeUploaded="beforeUpload">
           <button class="btn btn-primary" disabled>正在上传</button>
         </slot>
         <slot v-else-if="fileStatus === 'success'" name="uploaded" :uploadedData="uploadedData">
           <button class="btn btn-primary" >上传成功</button>
         </slot>
         <slot v-else name="default">
           <button class="btn btn-primary" >点击上传</button>
         </slot>
        </div>
        <input type="file"
        class="file-input d-none"
        ref="fileInput"
        @change="handleFileChange"
        >
    </div>
</template>
<script lang="ts">
import { PropType, defineComponent, ref, watch } from 'vue'
import axios from 'axios'
type UploadStatus = 'ready' | 'loading' | 'success' | 'error'
type CheckFunction = (file :File) =>boolean;
export default defineComponent({
  props: {
    action: {
      type: String,
      required: true
    },
    beforeUpload: {
      type: Function as PropType<CheckFunction>
    },
    uploaded: {
      type: Object
    }
  },
  emits: ['file-uploaded', 'file-uploaded-error', 'file-data', 'update:modelValue'],
  setup (props, { emit }) {
    const fileInput = ref<null | HTMLInputElement>(null)
    const fileStatus = ref<UploadStatus>('ready')
    const uploadedData = ref(props.uploaded)
    emit('file-uploaded', uploadedData)
    console.log(uploadedData)
    watch(() => props.uploaded, (newValue) => {
      if (newValue) {
        fileStatus.value = 'success'
        uploadedData.value = newValue
      }
    })
    // 切换到输入文件那块
    const triggerUpload = () => {
      if (fileInput.value) {
        fileInput.value.click()
      }
    }
    // 上传文件
    const handleFileChange = (e: Event) => {
      const currentTarget = e.target as HTMLInputElement
      if (currentTarget.files) {
        const files = Array.from(currentTarget.files)
        // 检查文件是否存在
        if (props.beforeUpload) {
          const result = props.beforeUpload(files[0])
          if (!result) {
            return
          }
        }
        fileStatus.value = 'loading'
        const formData = new FormData()
        formData.append('file', files[0])
        // 上传文件
        axios.post(props.action, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(resp => {
          fileStatus.value = 'success'
          uploadedData.value = resp.data.data
          console.log(resp)
          console.log(uploadedData)
          // emit('file-uploaded', uploadedData)
          emit('update:modelValue', uploadedData)
        }).catch((e) => {
          fileStatus.value = 'error'
          emit('file-uploaded-error', { e })
        }).finally(() => {
          if (fileInput.value) {
            fileInput.value.type = ' '
          }
        })
      }
    }
    return {
      fileInput,
      triggerUpload,
      handleFileChange,
      fileStatus,
      uploadedData
    }
  }
})
</script>
