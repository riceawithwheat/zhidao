import { onUnmounted } from 'vue'

function useDOMCreate (nodeId: string) {
  console.log('wozai1chuanjiandom')
  const node = document.createElement('div')
  node.id = nodeId
  document.body.appendChild(node)
  onUnmounted(() => {
    document.body.removeChild(node)
  })
}

export default useDOMCreate
