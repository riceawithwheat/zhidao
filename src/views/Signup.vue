<!-- eslint-disable vue/valid-v-slot -->
<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="signup-page mx-auto p-3 w-330">
      <h5 class="my-4 text-center">注册者也账户</h5>
      <validate-form @form-submit="onFormSubmit">
      <div class="mb-3">
          <label class="form-label">邮箱地址</label>
          <validate-input
          :rules="emailRules" v-model="formData.email"
          placeholder="请输入邮箱地址"
          type="text"
          ></validate-input>
      </div>
          <div class="mb-3">
              <label class="form-label">昵称</label>
              <validate-input
              :rules="nameRules" v-model="formData.name"
              placeholder="请输入昵称"
              type="text"
              ></validate-input>
          </div>
          <div class="mb-3">
              <label class="form-label">密码</label>
              <validate-input
              :rules="passwordRules" v-model="formData.password"
              placeholder="请输入密码"
              type="password"
              ></validate-input>
          </div>
          <div class="mb-3">
              <label class="form-label">重复密码</label>
              <validate-input
              :rules="repeatePasswordRules" v-model="formData.repeatePassword"
              placeholder="请再次输入密码"
              type="password"
              ></validate-input>
          </div>
          <template #submit>
              <button type="submit" class="btn btn-primary btn-block btn-large">注册新用户</button>
          </template>
  </validate-form>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import ValidateForm from '@/components/ValidateForm.vue'
import ValidateInput, { RulesProp } from '@/components/ValidateInput.vue'
import createMessage from '../components/createMessage'
export default defineComponent({
// eslint-disable-next-line vue/multi-word-component-names
  name: 'Signup',
  components: {
    ValidateForm,
    ValidateInput
  },
  setup () {
    const formData = reactive({
      email: '',
      name: '',
      password: '',
      repeatePassword: ''
    })
    const router = useRouter()
    const emailRules: RulesProp = [
      { type: 'required', message: '电子邮箱地址不能为空' },
      { type: 'email', message: '请输入正确的电子邮箱格式' }
    ]
    const nameRules: RulesProp = [
      { type: 'required', message: '昵称不能为空' }
    ]
    const passwordRules: RulesProp = [
      { type: 'required', message: '密码不能为空' }
    ]
    const repeatePasswordRules: RulesProp = [
      { type: 'required', message: '重复密码不能为空' },
      {
        type: 'custom',
        validator: () => {
          return formData.password === formData.repeatePassword
        },
        message: '密码不相同'
      }
    ]
    const onFormSubmit = (result: boolean) => {
      if (result) {
        const payload = {
          email: formData.email,
          password: formData.password,
          name: formData.name
        }
        axios.post('/common/register', payload).then(() => {
          createMessage('注册成功 正在跳转登录页面', 'success', 2000)
          setTimeout(() => {
            router.push('/login')
          }, 2000)
        }).catch(e => {
          console.log(e)
        })
      }
    }
    return {
      emailRules,
      nameRules,
      passwordRules,
      repeatePasswordRules,
      onFormSubmit,
      formData
    }
  }
})
</script>
<style>
.w-330 {
max-width: 330px;
}
</style>
