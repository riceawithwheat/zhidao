<template>
    <form class="validate-form-container">
      <!-- slot一个默认区域的插槽 用来接收表单内容区域 -->
        <slot name="default"></slot>
      <div class="submit-area" @click="submitForm">
        <!-- submit具名插槽，用来接收button领域 -->
        <slot name="submit">
          <button type="submit" class="btn btn-primary">提交</button>
        </slot>
    </div>
    </form>
</template>

<script lang="ts">
import { defineComponent, onUnmounted } from 'vue'
import mitt from 'mitt'
// 定义一个返回布尔类型函数的类型
type ValidateFunc = () => boolean
// 实例化mitt
export const emitter = mitt()
export default defineComponent({
// 用来发送事件，去点击按钮提交表单
  emits: ['form-submit'],
  setup (props, context) {
    let funcArr: ValidateFunc[] = []
    // 设置函数去执行form-submit事件
    const submitForm = () => {
    // 循环执行数组，得到最后的验证结果
      const result = funcArr.map(func => func()).every(result => result)
      context.emit('form-submit', result)
      console.log(result)
    }
    // 设置callback函数
    const callback = (func?: ValidateFunc) => {
      if (func) {
        funcArr.push(func)
      }
    }
    // 添加监听  !!!此处应该是on或者off
    emitter.emit('form-item-created', callback)
    onUnmounted(() => {
    //   删除监听
      emitter.emit('form-item-created', callback)
      funcArr = []
    })
    return {
      submitForm
    }
  }
})
</script>
