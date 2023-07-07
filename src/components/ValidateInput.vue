<template>
    <div class="validate-input-container pb-3">
        <input v-if="tag !== 'textarea'"
        class="form-control"
        :class="{ 'is-invalid': inputRef.error}"
        v-model="inputRef.val"
        @blur="validteInput"
        >
        <!-- is-invalid这是一个bootstrap提供的报错警告框，inputRef.error控制是否出现 -->
        <textarea v-else
        class="form-control"
        :class="{ 'is-invalid': inputRef.error}"
        @blur="validteInput"
        v-model="inputRef.val"
        v-bind ="$attrs"
        >
      </textarea>
        <!-- @blur失去焦点时触发验证数据是否有效 -->
        <span v-if="inputRef.error" class="invalid-feedback">{{ inputRef.message }}</span>
    </div>
</template>

<script lang="ts">
import { PropType, defineComponent, reactive, onMounted, computed } from 'vue'
import { emitter } from './ValidateForm.vue'
// email的正则表达式
const emailReg = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
// required表示该电子邮件不能为空，email表示该邮箱的正确格式
interface RuleProp {
  type: 'required' | 'email' | 'custom';
  message: string;
  validator?: () => boolean
}
export type RulesProp = RuleProp[]
export type TagType = 'input' | 'textarea'
export default defineComponent({
// 定义一个电子邮件类型的rules
  props: {
    rules: Array as PropType<RulesProp>,
    modelValue: String,
    tag: {
      type: String as PropType<TagType>,
      default: 'input'
    }
  },
  // inheritAttrs是一个阻止例如placeholder属性被组件根节点继承的属性
  // 跟#attrs联合使用
  inheritAttrs: false,
  setup (props, context) {
    // 定义一个响应式对象的输入
    // 让v-model生效的关键在于每次更新都发射一个update事件
    const inputRef = reactive({
      val: computed({
        get: () => props.modelValue || '',
        set: val => {
          context.emit('update:modelValue', val)
        }
      }),
      error: false,
      message: ''
    })
    // @input :一般用于监听事件只要输入的值变化了就会触发input
    // 当iput输入值变化时，调用validteInput去验证电子邮件和密码是否符合格式
    const validteInput = () => {
      if (props.rules) {
        const allPassed = props.rules.every(rule => {
          let passed = true
          inputRef.message = rule.message
          switch (rule.type) {
            case 'required':
              passed = (inputRef.val.trim() !== '')
              break
            case 'email':
              // 用emailReg这个正则表达式，以test方法去验证val里面的数据是否符合格式
              passed = emailReg.test(inputRef.val)
              break
            case 'custom':
              passed = rule.validator ? rule.validator() : true
              break
            default:
              break
          }
          return passed
        })
        // 通过inputRef.error的值取反，去确定电子邮箱是否通过
        inputRef.error = !allPassed
        return allPassed
      }
      return true
    }
    // 将事件发射出去，其实就是把验证函数发射出去
    onMounted(() => {
      emitter.emit('form-item-created', validteInput)
    })

    return {
      inputRef,
      validteInput
    }
  }
})
</script>
