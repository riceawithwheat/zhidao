<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div class="vue-easymde-editor">
        <textarea ref="textArea" ></textarea>
    </div>
</template>
<script lang="ts" setup>
import { defineProps, defineEmits, ref, onMounted, onUnmounted, defineExpose, watch } from 'vue'
import EasyMDE, { Options } from 'easymde'
// 类型，属性，以及事件
interface EditorProps {
    modelValue?: string;
    Option?: Options;
}
interface EditorEvents {
    (type: 'update:modelValue', value: string): void;
    (type: 'change', value: string): void;
    (type: 'blur'): void;
}
const props = defineProps<EditorProps>()
const emits = defineEmits<EditorEvents>()
// 有了模板我们需要一些初始的数据
// 1、暴露对应的方法
// 2、结合页面实现验证功能
const textArea = ref<null | HTMLTextAreaElement>(null)
// 实例化一个easyMDE对象
// eslint-disable-next-line prefer-const
let easyMDEInstance: EasyMDE | null = null
const innerValue = ref(props.modelValue || '')
watch(() => props.modelValue, (newValue) => {
  if (easyMDEInstance) {
    if (newValue !== innerValue.value) {
      easyMDEInstance.value(newValue || '')
    }
  }
})
onMounted(() => {
  console.log(textArea.value)
  if (textArea.value) {
    // 组装options
    const config: Options = {
      ...(props.Option || {}),
      element: textArea.value,
      initialValue: innerValue.value
    }
    easyMDEInstance = new EasyMDE(config)
    // 监控对应的事件
    easyMDEInstance.codemirror.on('change', () => {
      if (easyMDEInstance) {
        // 拿到当前的值
        // 加上括号是string 不加括号是实例对象
        const updatedValue = easyMDEInstance.value()
        // console.log(updatedValue)
        innerValue.value = updatedValue
        emits('update:modelValue', updatedValue)
        emits('change', updatedValue)
      }
    })
    easyMDEInstance.codemirror.on('blur', () => {
      if (easyMDEInstance) {
        emits('blur')
      }
    })
  }
})
// 销毁对应的实例
onUnmounted(() => {
  if (easyMDEInstance) {
    easyMDEInstance.cleanup()
  }
  easyMDEInstance = null
})
const clear = () => {
  if (easyMDEInstance) {
    easyMDEInstance.value('')
  }
}
const getMDEInstance = () => {
  return easyMDEInstance
}
defineExpose({
  clear,
  getMDEInstance
})
</script>
<style>
.vue-easymde-editor.is-invalid {
  border: 1px solid #dc3545;
}
</style>
