<template>
    <div class="weather">
      <div id="he-plugin-standard">
      </div>
    </div>
    <img src="../assets/weather.jpg" alt="" class="image">
  </template>
<script>
import { defineComponent, onMounted } from 'vue'
window.WIDGET = {
  CONFIG: {
    layout: '1',
    width: '960',
    height: '150',
    background: '1',
    dataColor: 'FFFFFF',
    borderRadius: '5',
    key: '4b55334ebcc44bdd98f430420b7c1a2d'
  }
}
export default defineComponent({
  setup () {
    onMounted(() => {
      weather()
    })
    const weather = () => {
      const s = document.createElement('script')
      s.type = 'text/javascript'
      s.src =
          'https://widget.qweather.net/standard/static/js/he-standard-common.js?v=2.0'
      document.body.appendChild(s)
    }

    return {}
  }
})
</script>
  <style lang="scss" scoped>
  .weather {
    position: relative;
    margin: 0 !important;;
    width: 100% !important;
    height: 100%;
  }
.image{
    position: absolute;
    top: 80px;
    right: 120px;
    width: 325px;
    height: 150px;
    object-fit: cover;
}
  </style>
