<template>
    <div class="tech-component">
      <div class="falling-code">
        <div v-for="codeLine in fallingCode" :key="codeLine.id" class="code-line" :style="codeLine.style">
          {{ codeLine.text }}
        </div>
      </div>
      <div class="tech-content">
        <div class="centered-text">
          <div class="blue-gradient-text larger-text">科技 知识 </div>
          <div class="blue-gradient-text larger-text">未来即将到来</div>
          <div class="single-line-text smaller-text">{{ title }}</div>
          <div class="single-line-text smaller-text">{{ description }}</div>
        </div>
      </div>
    </div>
  </template>

<script setup lang="ts">
import { defineProps, ref } from 'vue'

  interface CodeLine {
    id: number;
    text: string;
    style: Record<string, string>;
  }

const props = defineProps({
  title: {
    type: String,
    default: 'Tech Component'
  },
  description: {
    type: String,
    default: 'Explore the cutting-edge technologies.'
  }
})

const fallingCode = ref<CodeLine[]>([])

// Generate falling code lines
for (let i = 0; i < 20; i++) {
  fallingCode.value.push({
    id: i,
    text: generateRandomCodeLine(),
    style: {
      left: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 5 + 3}s`,
      animationDelay: `${i * 0.2}s`,
      opacity: `${Math.random() * 0.5 + 0.2}`
    }
  })
}

function generateRandomCodeLine (): string {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+'
  const lineLength = Math.floor(Math.random() * 30) + 10
  let codeLine = ''
  for (let i = 0; i < lineLength; i++) {
    codeLine += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return codeLine
}
</script>

  <style scoped>
  .tech-component {
    background-image: linear-gradient(45deg, #FF5050, #0099FF);
    background-size: cover;
    background-attachment: fixed;
    color: #fff;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
  }

  .falling-code {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  .code-line {
    color: rgba(0, 0, 0, 0.654);
    opacity: 0.5;
    position: absolute;
    animation: fall linear infinite;
    margin-bottom: 50px;
  }

  @keyframes fall {
    0% {
      transform: translateY(-100%);
    }
    100% {
      transform: translateY(100vh);
    }
  }

  .tech-content {
    position: relative;
    text-align: center;
  }

  .centered-text {
    text-align: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .blue-gradient-text {
    width: 500px;
    font-size: 60px;
    background: linear-gradient(45deg, #0099FF, #66CCFF);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    margin-top: 20px;
  }
  .blue-gradient-text:first-child{
    float: left;
  }

  .single-line-text {
    font-size: 20px;
    opacity: 0.1;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3); /* 添加阴影效果 */
  }

  .hollow-text {
    font-size: inherit;
    text-align: center;
    font-weight: bold;
    letter-spacing: 3px;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  }
  </style>
